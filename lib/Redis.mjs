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

  async cacheOtp (referenceId = '', otp = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_OTP`
    return redisSdk.setAndExpire(redisKey, otp, OTP_EXPIRY_IN_SECS)
  }

  async getCachedOtp (referenceId = '') {
    const { redisSdk } = this
    const redisKey = `OTP_${referenceId}_OTP`
    return redisSdk.get(redisKey)
  }

  async doesCacheExists (referenceId = '') {
    const { redisSdk } = this
    const redisKey = `OTP_${referenceId}_OTP`
    return redisSdk.exists(redisKey)
  }

  async setRegenHalt (referenceId = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_GEN_HALT_IN_SECS } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_REGEN_HALT`
    return redisSdk.setAndExpire(redisKey, 1, OTP_GEN_HALT_IN_SECS)
  }

  async getRegenHalt (referenceId = '') {
    const { redisSdk } = this
    const redisKey = `OTP_${referenceId}_REGEN_HALT`
    return redisSdk.get(redisKey)
  }

  async setRegenCount (referenceId = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_REGEN_CT`
    return redisSdk.setAndExpire(redisKey, 0, OTP_EXPIRY_IN_SECS)
  }

  async incRegenCount (referenceId = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_REGEN_CT`
    return redisSdk.incrByAndExpire(redisKey, 1, OTP_EXPIRY_IN_SECS)
  }

  async doesGenCountExists (uid = '') {
    const { redisSdk } = this
    const redisKey = `OTP_${uid}_GEN_CT`
    return redisSdk.exists(redisKey)
  }

  async getGenCount (uid = '') {
    const { redisSdk } = this
    const redisKey = `OTP_${uid}_GEN_CT`
    return redisSdk.get(redisKey)
  }

  async setGenCount (uid = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_GEN_LIMIT_EXPIRY_IN_SEC } = OTP_CONFIG
    const redisKey = `OTP_${uid}_GEN_CT`
    return redisSdk.setAndExpire(redisKey, 1, OTP_GEN_LIMIT_EXPIRY_IN_SEC)
  }

  async incGenCount (uid = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_GEN_LIMIT_EXPIRY_IN_SEC } = OTP_CONFIG
    const redisKey = `OTP_${uid}_GEN_CT`
    return redisSdk.incrByAndExpire(redisKey, 1, OTP_GEN_LIMIT_EXPIRY_IN_SEC)
  }

  async getGenFor (referenceId = '') {
    const { redisSdk } = this
    const redisKey = `OTP_${referenceId}_GEN_FOR`
    return redisSdk.get(redisKey)
  }

  async setGenFor (referenceId = '', uidString = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_GEN_LIMIT_EXPIRY_IN_SEC } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_GEN_FOR`
    return redisSdk.setAndExpire(redisKey, uidString, OTP_GEN_LIMIT_EXPIRY_IN_SEC)
  }

  async setValidCount (referenceId = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_VAL_CT`
    return redisSdk.setAndExpire(redisKey, 0, OTP_EXPIRY_IN_SECS)
  }

  async incValidCount (referenceId = '') {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_VAL_CT`
    return redisSdk.incrByAndExpire(redisKey, 1, OTP_EXPIRY_IN_SECS)
  }

  async clearKeys (referenceId = '') {
    const { redisSdk } = this
    const uidsString = await this.getGenFor(referenceId) || ''
    const uids = uidsString.split(',')
    for (const uid of uids) {
      const redisKey = `OTP_${uid}_*`
      await redisSdk.delByPattern(redisKey)
    }
    const redisKey = `OTP_${referenceId}_*`
    return redisSdk.delByPattern(redisKey)
  }
}
