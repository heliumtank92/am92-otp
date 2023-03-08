export default class Redis {
    constructor(REDIS_CONFIG: any, OTP_CONFIG: any);
    redisSdk: any;
    OTP_CONFIG: any;
    initialize(): Promise<void>;
    cacheOtp(referenceId?: string, otp?: string): Promise<any>;
    getCachedOtp(referenceId?: string): Promise<any>;
    doesCacheExists(referenceId?: string): Promise<any>;
    setRegenHalt(referenceId?: string): Promise<any>;
    getRegenHalt(referenceId?: string): Promise<any>;
    setRegenCount(referenceId?: string): Promise<any>;
    incRegenCount(referenceId?: string): Promise<any>;
    doesGenCountExists(uid?: string): Promise<any>;
    getGenCount(uid?: string): Promise<any>;
    setGenCount(uid?: string): Promise<any>;
    incGenCount(uid?: string): Promise<any>;
    getGenFor(referenceId?: string): Promise<any>;
    setGenFor(referenceId?: string, uidString?: string): Promise<any>;
    setValidCount(referenceId?: string): Promise<any>;
    incValidCount(referenceId?: string): Promise<any>;
    clearKeys(referenceId?: string): Promise<any>;
}
