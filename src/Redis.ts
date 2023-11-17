import RedisSdk, { RedisSdkConfig } from '@am92/redis'
import { OtpConfig } from './TYPES'

/** @internal */
export default class Redis {
  redisSdk: RedisSdk
  REDIS_CONFIG: RedisSdkConfig
  OTP_CONFIG: OtpConfig

  constructor(REDIS_CONFIG: RedisSdkConfig, OTP_CONFIG: OtpConfig) {
    this.redisSdk = new RedisSdk(REDIS_CONFIG)
    this.REDIS_CONFIG = this.redisSdk.CONFIG
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

  async initialize(): Promise<void> {
    await this.redisSdk.connect()
  }

  async cacheOtp(referenceId = '', otp = ''): Promise<string | null> {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_OTP`
    return redisSdk.setAndExpire(redisKey, otp, OTP_EXPIRY_IN_SECS)
  }

  async getCachedOtp(referenceId = ''): Promise<string | null> {
    const { redisSdk } = this
    const redisKey = `OTP_${referenceId}_OTP`
    return redisSdk.get(redisKey)
  }

  async doesCacheExists(referenceId = ''): Promise<number> {
    const { redisSdk } = this
    const redisKey = `OTP_${referenceId}_OTP`
    return redisSdk.exists([redisKey])
  }

  async setRegenHalt(referenceId = ''): Promise<string | null> {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_GEN_HALT_IN_SECS } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_REGEN_HALT`
    return redisSdk.setAndExpire(redisKey, '1', OTP_GEN_HALT_IN_SECS)
  }

  async getRegenHalt(referenceId = ''): Promise<string | null> {
    const { redisSdk } = this
    const redisKey = `OTP_${referenceId}_REGEN_HALT`
    return redisSdk.get(redisKey)
  }

  async setRegenCount(referenceId = ''): Promise<string | null> {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_REGEN_CT`
    return redisSdk.setAndExpire(redisKey, '0', OTP_EXPIRY_IN_SECS)
  }

  async incRegenCount(referenceId = ''): Promise<number> {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_REGEN_CT`
    return redisSdk.incrByAndExpire(redisKey, 1, OTP_EXPIRY_IN_SECS)
  }

  async doesGenCountExists(uid = ''): Promise<number> {
    const { redisSdk } = this
    const redisKey = `OTP_${uid}_GEN_CT`
    return redisSdk.exists([redisKey])
  }

  async getGenCount(uid = ''): Promise<string | null> {
    const { redisSdk } = this
    const redisKey = `OTP_${uid}_GEN_CT`
    return redisSdk.get(redisKey)
  }

  async setGenCount(uid = ''): Promise<number> {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_GEN_LIMIT_EXPIRY_IN_SEC } = OTP_CONFIG
    const redisKey = `OTP_${uid}_GEN_CT`
    return redisSdk.incrByAndExpire(redisKey, 1, OTP_GEN_LIMIT_EXPIRY_IN_SEC)
  }

  async incGenCount(uid = ''): Promise<number> {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_GEN_LIMIT_EXPIRY_IN_SEC } = OTP_CONFIG
    const redisKey = `OTP_${uid}_GEN_CT`
    return redisSdk.incrByAndExpire(redisKey, 1, OTP_GEN_LIMIT_EXPIRY_IN_SEC)
  }

  async getGenFor(referenceId = ''): Promise<string | null> {
    const { redisSdk } = this
    const redisKey = `OTP_${referenceId}_GEN_FOR`
    return redisSdk.get(redisKey)
  }

  async setGenFor(referenceId = '', uidString = ''): Promise<string | null> {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_GEN_LIMIT_EXPIRY_IN_SEC } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_GEN_FOR`
    return redisSdk.setAndExpire(
      redisKey,
      uidString,
      OTP_GEN_LIMIT_EXPIRY_IN_SEC
    )
  }

  async setValidCount(referenceId = ''): Promise<string | null> {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_VAL_CT`
    return redisSdk.setAndExpire(redisKey, '0', OTP_EXPIRY_IN_SECS)
  }

  async incValidCount(referenceId = ''): Promise<number> {
    const { OTP_CONFIG, redisSdk } = this
    const { OTP_EXPIRY_IN_SECS } = OTP_CONFIG
    const redisKey = `OTP_${referenceId}_VAL_CT`
    return redisSdk.incrByAndExpire(redisKey, 1, OTP_EXPIRY_IN_SECS)
  }

  async clearKeys(referenceId = ''): Promise<number> {
    const { redisSdk } = this
    const uidsString = (await this.getGenFor(referenceId)) || ''
    const uids = uidsString.split(',')
    for (const uid of uids) {
      const redisKey = `OTP_${uid}_*`
      await redisSdk.delByPattern(redisKey)
    }
    const redisKey = `OTP_${referenceId}_*`
    return redisSdk.delByPattern(redisKey)
  }
}
