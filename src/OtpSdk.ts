import crypto from 'crypto'
import _ from 'lodash'
import { RedisSdkConfig } from '@am92/redis'
import CONFIG from './CONFIG'
import {
  OTP_SDK_NOT_INITIALIZED_ERROR,
  OTP_GEN_EXCEEDED_ERROR,
  INVALID_REGEN_REF_ID_ERROR,
  OTP_REGEN_ON_HALT_ERROR,
  OTP_REGEN_EXCEEDED_ERROR,
  OTP_VAL_EXCEEDED_ERROR,
  OTP_EXPIRED_ERROR,
  INVALID_REF_ID_ERROR
} from './ERRORS'
import { OtpError } from './OtpError'
import Redis from './Redis'
import {
  OtpConfig,
  OtpSdkConfig,
  OtpGenerateProp,
  OtpGenerateData,
  OtpValidateProp,
  OtpValidateData
} from './TYPES'
import { OtpShouldGenerateData } from './TYPES_INTERNAL'

/**
 * Class to create an SDK which provides HOTP functionalities
 *
 * @class
 */
export class OtpSdk {
  /** @private */
  #initialized = false

  /** @private */
  #redis: Redis

  /**
   * Redis Configurations used by the OtpSdk instance
   */
  REDIS_CONFIG: RedisSdkConfig
  /**
   * HOTP Configurations used by the OtpSdk instance
   */
  OTP_CONFIG: OtpConfig

  /**
   * Creates an instance of OtpSdk.
   *
   * @constructor
   * @param [config]
   */
  constructor(config?: OtpSdkConfig) {
    const thisConfig = _.merge(CONFIG, config)
    const { REDIS_CONFIG, OTP_CONFIG } = thisConfig

    this.#redis = new Redis(REDIS_CONFIG, OTP_CONFIG)
    this.REDIS_CONFIG = this.#redis.REDIS_CONFIG
    this.OTP_CONFIG = OTP_CONFIG

    this.initialize = this.initialize.bind(this)
    this.generate = this.generate.bind(this)
    this.validate = this.validate.bind(this)
  }

  /**
   * Initialize the OtpSdk instance. It internally creates a Redis connection
   *
   * @async
   * @returns
   */
  async initialize(): Promise<void> {
    await this.#redis.initialize()
    this.#initialized = true
  }

  /**
   * Generate or Re-generate an HOTP
   *
   * @async
   * @param [attrs]
   * @returns
   */
  async generate(attrs?: OtpGenerateProp): Promise<OtpGenerateData> {
    const { uids = [] } = attrs || {}

    // Validate Generation and Get referenceId
    const { referenceId, regen } = await this.#shouldGenerate(attrs)

    // Generate HOTP
    const otp = this.#generateHotp()

    // Manage Redis Keys
    const promises = [
      this.#redis.cacheOtp(referenceId, otp),
      this.#redis.setRegenHalt(referenceId),
      this.#redis.setValidCount(referenceId)
    ]

    if (!regen) {
      promises.push(this.#redis.setRegenCount(referenceId))
      promises.push(this.#redis.setGenFor(referenceId, uids.toString()))
    }

    await Promise.allSettled(promises)

    // Return Generated Otp
    const data: OtpGenerateData = { referenceId, otp, regen }
    return data
  }

  /**
   * Validate a previously generated HOTP
   *
   * @async
   * @param attrs
   * @returns
   */
  async validate(attrs: OtpValidateProp): Promise<OtpValidateData> {
    // Validate Validation and Get Cached Otp
    const cachedOtp = await this.#shouldValidate(attrs)

    const { referenceId, otp } = attrs || {}
    const valid = otp === cachedOtp

    // Handle Otp Validations After Sending Response
    if (valid) {
      await this.#redis.clearKeys(referenceId)
    }

    const data: OtpValidateData = { referenceId, valid }
    return data
  }

  /** @private */
  async #shouldGenerate(
    attrs?: OtpGenerateProp
  ): Promise<OtpShouldGenerateData> {
    if (!this.#initialized) {
      throw new OtpError(attrs, OTP_SDK_NOT_INITIALIZED_ERROR)
    }

    const { OTP_CONFIG } = this
    const { OTP_GEN_LIMIT, OTP_REGEN_LIMIT } = OTP_CONFIG
    const { referenceId, uids = [] } = attrs || {}

    // Generate New referenceId If Not Provide or Not Cached
    if (!referenceId) {
      // Validate Generate Count
      for (const uid of uids) {
        const generateCount = await this.#redis.incGenCount(uid)
        if (generateCount > OTP_GEN_LIMIT) {
          throw new OtpError(attrs, OTP_GEN_EXCEEDED_ERROR)
        }
      }

      return { referenceId: crypto.randomUUID(), regen: false }
    }

    const doesCacheExists = await this.#redis.doesCacheExists(referenceId)
    if (!doesCacheExists) {
      throw new OtpError(attrs, INVALID_REGEN_REF_ID_ERROR)
    }

    // Validate Regenerate Halt
    const shouldHalt = await this.#redis.getRegenHalt(referenceId)
    if (shouldHalt) {
      throw new OtpError(attrs, OTP_REGEN_ON_HALT_ERROR)
    }

    // Validate Regenerate Count
    const regenerateCount = await this.#redis.incRegenCount(referenceId)
    if (regenerateCount > OTP_REGEN_LIMIT) {
      throw new OtpError(attrs, OTP_REGEN_EXCEEDED_ERROR)
    }

    // Return RefereceId
    return { referenceId, regen: true }
  }

  /** @private */
  #generateHotp(): string {
    const { OTP_CONFIG } = this
    const { OTP_LENGTH } = OTP_CONFIG

    // Create HMAC
    const hashKey = crypto.randomBytes(20)
    const hmac = crypto.createHmac('sha1', hashKey)

    // Generate Digest
    const digestSecret = crypto.randomUUID()
    const digest = hmac.update(digestSecret).digest('hex')

    // Pluck Digest Substring
    const offset = parseInt(digest.slice(-1), 16)
    const substring = digest.slice(offset, offset + 8)

    // Build Otp from Digest Substring
    const decimal = parseInt(substring, 16)
    const otp = _.padStart(
      (decimal % Math.pow(10, OTP_LENGTH)).toString(),
      OTP_LENGTH,
      '0'
    )

    return otp
  }

  /** @private */
  async #shouldValidate(attrs: OtpValidateProp): Promise<string> {
    if (!this.#initialized) {
      throw new OtpError(attrs, OTP_SDK_NOT_INITIALIZED_ERROR)
    }

    const { OTP_CONFIG } = this
    const { OTP_VAL_LIMIT } = OTP_CONFIG
    const { referenceId } = attrs || {}

    // Validate Validation Count
    const validationCount = await this.#redis.incValidCount(referenceId)
    if (validationCount > OTP_VAL_LIMIT) {
      throw new OtpError(attrs, OTP_VAL_EXCEEDED_ERROR)
    }

    // Get Cached Otp
    const cachedOtp = await this.#redis.getCachedOtp(referenceId)
    const genFor = await this.#redis.getGenFor(referenceId)
    if (!cachedOtp) {
      if (genFor) {
        throw new OtpError(attrs, OTP_EXPIRED_ERROR)
      } else {
        throw new OtpError(attrs, INVALID_REF_ID_ERROR)
      }
    }

    // Return Cached Otp
    return cachedOtp
  }
}
