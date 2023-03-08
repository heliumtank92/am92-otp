import crypto from 'crypto'
import _ from 'lodash'
import Redis from './Redis.mjs'
import OtpError from '../OtpError.mjs'
import ERRORS from '../ERRORS.mjs'

export default class Hotp extends Redis {
  #initialized = false
  constructor (REDIS_CONFIG, OTP_CONFIG) {
    super(REDIS_CONFIG, OTP_CONFIG)

    this.initialize = this.initialize.bind(this)
    this.generate = this.generate.bind(this)
    this.validate = this.validate.bind(this)
  }

  async initialize () {
    await super.initialize()
    this.#initialized = true
  }

  async generate (attrs = {}) {
    const { uids = [] } = attrs

    // Validate Generation and Get referenceId
    const { referenceId, regen = false } = await this.#shouldGenerate(attrs)

    // Generate HOTP
    const otp = this.#generateHotp()

    // Manage Redis Keys
    const promises = [
      this.cacheOtp(referenceId, otp),
      this.setRegenHalt(referenceId),
      this.setGenFor(referenceId, uids.toString()),
      this.setValidCount(referenceId)
    ]

    if (regen) {
      promises.push(this.setRegenCount(referenceId))
    }

    await Promise.allSettled(promises)

    // Return Generated Otp
    return { referenceId, otp, regen }
  }

  async validate (attrs = {}) {
    // Validate Validation and Get Cached Otp
    const cachedOtp = await this.#shouldValidate(attrs)

    const { referenceId, otp } = attrs
    const valid = otp === cachedOtp

    // Handle Otp Validations After Sending Response
    if (valid) {
      await this.clearKeys(referenceId)
    }

    return { referenceId, valid }
  }

  async #shouldGenerate (attrs = {}) {
    if (!this.#initialized) {
      throw new OtpError(attrs, ERRORS.HOTP_NOT_INITIALIZED_ERROR)
    }

    const { OTP_CONFIG } = this
    const { OTP_GEN_LIMIT, OTP_REGEN_LIMIT } = OTP_CONFIG
    const { referenceId, uids } = attrs

    // Validate Generate Count
    for (const uid of uids) {
      const generateCount = await this.incGenCount(uid)
      if (generateCount > OTP_GEN_LIMIT) {
        throw new OtpError(attrs, ERRORS.OTP_GEN_EXCEEDED_ERROR)
      }
    }

    // Generate New referenceId If Not Provide or Not Cached
    if (!referenceId) {
      return { referenceId: crypto.randomUUID() }
    }

    const doesCacheExists = await this.doesCacheExists(referenceId)
    if (!doesCacheExists) {
      throw new OtpError(attrs, ERRORS.INVALID_REGEN_REF_ID_ERROR)
    }

    // Validate Regenerate Halt
    const shouldHalt = await this.getRegenHalt(referenceId)
    if (shouldHalt) {
      throw new OtpError(attrs, ERRORS.OTP_REGEN_ON_HALT_ERROR)
    }

    // Validate Regenerate Count
    const generateCount = await this.incRegenCount(referenceId)
    if (generateCount > OTP_REGEN_LIMIT) {
      throw new OtpError(attrs, ERRORS.OTP_REGEN_EXCEEDED_ERROR)
    }

    // Return RefereceId
    return { referenceId, regen: true }
  }

  #generateHotp () {
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
    const otp = _.padStart((decimal % Math.pow(10, OTP_LENGTH)).toString(), OTP_LENGTH, '0')

    return otp
  }

  async #shouldValidate (attrs = {}) {
    if (!this.#initialized) {
      throw new OtpError(attrs, ERRORS.HOTP_NOT_INITIALIZED_ERROR)
    }

    const { OTP_CONFIG } = this
    const { OTP_VAL_LIMIT } = OTP_CONFIG
    const { referenceId } = attrs

    // Validate Validation Count
    const validationCount = await this.incValidCount(referenceId)
    if (validationCount > OTP_VAL_LIMIT) {
      throw new OtpError(attrs, ERRORS.OTP_VAL_EXCEEDED_ERROR)
    }

    // Get Cached Otp
    const cachedOtp = await this.getCachedOtp(referenceId)
    const genFor = await this.getGenFor(referenceId)
    if (!cachedOtp) {
      if (genFor) {
        throw new OtpError(attrs, ERRORS.OTP_EXPIRED_ERROR)
      } else {
        throw new OtpError(attrs, ERRORS.INVALID_REF_ID_ERROR)
      }
    }

    // Return Cached Otp
    return cachedOtp
  }
}
