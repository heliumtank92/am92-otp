export default class Redis {
    constructor(REDIS_CONFIG: any, OTP_CONFIG: any);
    redisSdk: RedisSdk;
    OTP_CONFIG: any;
    initialize(): Promise<void>;
    cacheOtp(referenceId?: string, otp?: string): Promise<void>;
    getCachedOtp(referenceId?: string): Promise<string>;
    doesCacheExists(referenceId?: string): Promise<number>;
    setRegenHalt(referenceId?: string): Promise<void>;
    getRegenHalt(referenceId?: string): Promise<string>;
    setRegenCount(referenceId?: string): Promise<void>;
    incRegenCount(referenceId?: string): Promise<number>;
    doesGenCountExists(uid?: string): Promise<number>;
    getGenCount(uid?: string): Promise<string>;
    setGenCount(uid?: string): Promise<void>;
    incGenCount(uid?: string): Promise<number>;
    getGenFor(referenceId?: string): Promise<string>;
    setGenFor(referenceId?: string, uidString?: string): Promise<void>;
    setValidCount(referenceId?: string): Promise<void>;
    incValidCount(referenceId?: string): Promise<number>;
    clearKeys(referenceId?: string): Promise<void[]>;
}
import RedisSdk from '@am92/redis';
