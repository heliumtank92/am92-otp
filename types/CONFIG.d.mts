export default CONFIG;
declare namespace CONFIG {
    export { DEDICATED_REDIS };
    export namespace REDIS_CONFIG {
        export { REDIS_CONNECTION_CONFIG as CONNECTION_CONFIG };
        export { OTP_REDIS_KEY_PREFIX as KEY_PREFIX };
    }
    export namespace OTP_CONFIG {
        import OTP_LENGTH = INT_CONFIGS.OTP_LENGTH;
        export { OTP_LENGTH };
        import OTP_EXPIRY_IN_SECS = INT_CONFIGS.OTP_EXPIRY_IN_SECS;
        export { OTP_EXPIRY_IN_SECS };
        import OTP_GEN_HALT_IN_SECS = INT_CONFIGS.OTP_GEN_HALT_IN_SECS;
        export { OTP_GEN_HALT_IN_SECS };
        import OTP_GEN_LIMIT = INT_CONFIGS.OTP_GEN_LIMIT;
        export { OTP_GEN_LIMIT };
        import OTP_GEN_LIMIT_EXPIRY_IN_SEC = INT_CONFIGS.OTP_GEN_LIMIT_EXPIRY_IN_SEC;
        export { OTP_GEN_LIMIT_EXPIRY_IN_SEC };
        import OTP_REGEN_LIMIT = INT_CONFIGS.OTP_REGEN_LIMIT;
        export { OTP_REGEN_LIMIT };
        import OTP_VAL_LIMIT = INT_CONFIGS.OTP_VAL_LIMIT;
        export { OTP_VAL_LIMIT };
    }
}
export const SERVICE: string;
declare const DEDICATED_REDIS: boolean;
declare let REDIS_CONNECTION_CONFIG: any;
declare const OTP_REDIS_KEY_PREFIX: any;
declare namespace INT_CONFIGS {
    export { OTP_LENGTH };
    export { OTP_EXPIRY_IN_SECS };
    export { OTP_GEN_HALT_IN_SECS };
    export { OTP_GEN_LIMIT };
    export { OTP_GEN_LIMIT_EXPIRY_IN_SEC };
    export { OTP_REGEN_LIMIT };
    export { OTP_VAL_LIMIT };
}
declare const OTP_LENGTH_1: any;
declare const OTP_EXPIRY_IN_SECS_1: any;
declare const OTP_GEN_HALT_IN_SECS_1: any;
declare const OTP_GEN_LIMIT_1: any;
declare const OTP_GEN_LIMIT_EXPIRY_IN_SEC_1: any;
declare const OTP_REGEN_LIMIT_1: any;
declare const OTP_VAL_LIMIT_1: any;
