import crypto from 'crypto'
import _ from 'lodash'
import Redis from './Redis.mjs'
import OtpError from '../OtpError.mjs'
import {
  OTP_REGEN_ON_HALT,
  OTP_GEN_EXCEEDED,
  OTP_REGEN_EXCEEDED,
  OTP_VAL_EXCEEDED,
  OTP_EXPIRED
} from '../constants/ERRORS.mjs'

export default class Hotp extends Redis {
  constructor (REDIS_CONFIG, OTP_CONFIG) {
    super(REDIS_CONFIG, OTP_CONFIG)

    this.generate = this.generate.bind(this)
    this.validate = this.validate.bind(this)
  }

  async generate (attrs = {}) {
    const { Uids = [] } = attrs

    // Validate Generation and Get ReferenceId
    const { ReferenceId, Regen = false } = await this.#shouldGenerate(attrs)

    // Generate HOTP
    const Otp = this.#generateHotp()

    // Manage Redis Keys
    const promises = [
      this.cacheOtp(ReferenceId, Otp),
      this.setRegenHalt(ReferenceId)
    ]

    if (Regen) {
      promises.push(this.setRegenCount(ReferenceId))
      promises.push(this.setValidCount(ReferenceId))
      promises.push(this.setGenFor(ReferenceId, Uids.toString()))
    }

    await Promise.allSettled(promises)

    // Return Generated Otp
    return { ReferenceId, Otp, Regen }
  }

  async validate (attrs = {}) {
    // Validate Validation and Get Cached Otp
    const cachedOtp = await this.#shouldValidate(attrs)

    const { ReferenceId, Otp } = attrs
    const Valid = Otp === cachedOtp

    // Handle Otp Validations After Sending Response
    if (Valid) {
      await this.clearKeys(ReferenceId)
    }

    return { ReferenceId, Valid }
  }

  async #shouldGenerate (attrs = {}) {
    const { OTP_CONFIG } = this
    const { OTP_GEN_LIMIT, OTP_REGEN_LIMIT } = OTP_CONFIG
    const { ReferenceId, Uids } = attrs

    // Validate Generate Count
    for (const Uid of Uids) {
      const generateCount = await this.incGenCount(Uid)
      if (generateCount > OTP_GEN_LIMIT) {
        const otpError = OtpError.buildFromErrorMap(OTP_GEN_EXCEEDED, attrs)
        throw otpError
      }
    }

    // Generate New ReferenceId If Not Provide or Not Cached
    if (!ReferenceId) {
      return { ReferenceId: crypto.randomUUID() }
    }

    const doesCacheExists = await this.doesCacheExists(ReferenceId)
    if (!doesCacheExists) {
      return { ReferenceId }
    }

    // Validate ReGenerate Halt
    const shouldHalt = await this.getRegenHalt(ReferenceId)
    if (shouldHalt) {
      const otpError = OtpError.buildFromErrorMap(OTP_REGEN_ON_HALT, attrs)
      throw otpError
    }

    // Validate ReGenerate Count
    const generateCount = await this.incRegenCount(ReferenceId)
    if (generateCount > OTP_REGEN_LIMIT) {
      const otpError = OtpError.buildFromErrorMap(OTP_REGEN_EXCEEDED, attrs)
      throw otpError
    }

    // Return RefereceId
    return { ReferenceId, Regen: true }
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
    const Otp = _.padStart((decimal % Math.pow(10, OTP_LENGTH)).toString(), OTP_LENGTH)

    return Otp
  }

  async #shouldValidate (attrs = {}) {
    const { OTP_CONFIG } = this
    const { OTP_VAL_LIMIT } = OTP_CONFIG
    const { ReferenceId } = attrs

    // Validate Validation Count
    const validationCount = await this.incValidCount(ReferenceId)
    if (validationCount > OTP_VAL_LIMIT) {
      const otpError = OtpError.buildFromErrorMap(OTP_VAL_EXCEEDED, attrs)
      throw otpError
    }

    // Get Cached Otp
    const cachedOtp = await this.getCachedOtp(ReferenceId)
    if (!cachedOtp) {
      const otpError = OtpError.buildFromErrorMap(OTP_EXPIRED, attrs)
      throw otpError
    }

    // Return Cached Otp
    return cachedOtp
  }
}
