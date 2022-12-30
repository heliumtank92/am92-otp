import RedisSdk from '@am92/redis'

export default class Redis {
  constructor (REDIS_CONFIG, OTP_CONFIG) {
    this.redisSdk = new RedisSdk(REDIS_CONFIG)
    this.OTP_CONFIG = OTP_CONFIG

    this.initialize = this.initialize.bind(this)
    this.cacheOtp = this.cacheOtp.bind(this)
    this.getCachedOtp = this.getCachedOtp.bind(this)
    this.doesCacheExists = this.doesCacheExists.bind(this)
    this.setRegenHalt = this.setRegenHalt.bind(this)
    this.getRegenHalt = this.getRegenHalt.bind(this)
    this.setRegenCount = this.setRegenCount.bind(this)
    this.incRegenCount = this.incRegenCount.bind(this)
    this.doesGenCountExists = this.doesGenCountExists.bind(this)
    this.getGenCount = this.getGenCount.bind(this)
    this.setGenCount = this.setGenCount.bind(this)
    this.incGenCount = this.incGenCount.bind(this)
    this.getGenFor = this.getGenFor.bind(this)
    this.setGenFor = this.setGenFor.bind(this)
    this.setValidCount = this.setValidCount.bind(this)
    this.incValidCount = this.incValidCount.bind(this)
    this.clearKeys = this.clearKeys.bind(this)
  }

  async initialize () {
    await this.redisSdk.connect()
  }

  async cacheOtp (ReferenceId = '', Otp = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `otp_${ReferenceId}_OTP`
    return redisSdk.setAndExpire(redisKey, Otp, OTP_EXPIRY_IN_SECS)
  }

  async getCachedOtp (ReferenceId = '') {
    const { redisSdk } = this
    const redisKey = `otp_${ReferenceId}_OTP`
    return redisSdk.get(redisKey)
  }

  async doesCacheExists (ReferenceId = '') {
    const { redisSdk } = this
    const redisKey = `otp_${ReferenceId}_OTP`
    return redisSdk.exists(redisKey)
  }

  async setRegenHalt (ReferenceId = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_GEN_HALT_IN_SECS } = OTP_CONFIG
    const redisKey = `otp_${ReferenceId}_REGEN_HALT`
    return redisSdk.setAndExpire(redisKey, 1, OTP_GEN_HALT_IN_SECS)
  }

  async getRegenHalt (ReferenceId = '') {
    const { redisSdk } = this
    const redisKey = `otp_${ReferenceId}_REGEN_HALT`
    return redisSdk.get(redisKey)
  }

  async setRegenCount (ReferenceId = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `otp_${ReferenceId}_REGEN_CT`
    return redisSdk.setAndExpire(redisKey, 0, OTP_EXPIRY_IN_SECS)
  }

  async incRegenCount (ReferenceId = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `otp_${ReferenceId}_REGEN_CT`
    return redisSdk.incrByAndExpire(redisKey, 1, OTP_EXPIRY_IN_SECS)
  }

  async doesGenCountExists (Uid = '') {
    const { redisSdk } = this
    const redisKey = `otp_${Uid}_GEN_CT`
    return redisSdk.exists(redisKey)
  }

  async getGenCount (Uid = '') {
    const { redisSdk } = this
    const redisKey = `otp_${Uid}_GEN_CT`
    return redisSdk.get(redisKey)
  }

  async setGenCount (Uid = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_GEN_LIMIT_EXPIRY_IN_SEC } = OTP_CONFIG
    const redisKey = `otp_${Uid}_GEN_CT`
    return redisSdk.setAndExpire(redisKey, 1, OTP_GEN_LIMIT_EXPIRY_IN_SEC)
  }

  async incGenCount (Uid = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_GEN_LIMIT_EXPIRY_IN_SEC } = OTP_CONFIG
    const redisKey = `otp_${Uid}_GEN_CT`
    return redisSdk.incrByAndExpire(redisKey, 1, OTP_GEN_LIMIT_EXPIRY_IN_SEC)
  }

  async getGenFor (ReferenceId = '') {
    const { redisSdk } = this
    const redisKey = `otp_${ReferenceId}_GEN_FOR`
    return redisSdk.get(redisKey)
  }

  async setGenFor (ReferenceId = '', UidString = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_GEN_LIMIT_EXPIRY_IN_SEC } = OTP_CONFIG
    const redisKey = `otp_${ReferenceId}_GEN_FOR`
    return redisSdk.setAndExpire(redisKey, UidString, OTP_GEN_LIMIT_EXPIRY_IN_SEC)
  }

  async setValidCount (ReferenceId = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `otp_${ReferenceId}_VAL_CT`
    return redisSdk.setAndExpire(redisKey, 0, OTP_EXPIRY_IN_SECS)
  }

  async incValidCount (ReferenceId = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `otp_${ReferenceId}_VAL_CT`
    return redisSdk.incrByAndExpire(redisKey, 1, OTP_EXPIRY_IN_SECS)
  }

  async clearKeys (ReferenceId = '') {
    const { redisSdk } = this
    const UidsString = await this.getGenFor(ReferenceId)
    const Uids = UidsString.split(',')
    for (const Uid of Uids) {
      const redisKey = `otp_${Uid}_*`
      await redisSdk.delByPattern(redisKey)
    }
    const redisKey = `otp_${ReferenceId}_*`
    return redisSdk.delByPattern(redisKey)
  }
}
