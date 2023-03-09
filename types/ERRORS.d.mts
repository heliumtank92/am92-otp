export default ERRORS;
declare namespace ERRORS {
    namespace HOTP_NOT_INITIALIZED_ERROR {
        const message: string;
        const statusCode: number;
        const errorCode: string;
    }
    namespace INVALID_REF_ID_ERROR {
        const message_1: string;
        export { message_1 as message };
        const statusCode_1: number;
        export { statusCode_1 as statusCode };
        const errorCode_1: string;
        export { errorCode_1 as errorCode };
    }
    namespace INVALID_REGEN_REF_ID_ERROR {
        const message_2: string;
        export { message_2 as message };
        const statusCode_2: number;
        export { statusCode_2 as statusCode };
        const errorCode_2: string;
        export { errorCode_2 as errorCode };
    }
    namespace OTP_EXPIRED_ERROR {
        const message_3: string;
        export { message_3 as message };
        const statusCode_3: number;
        export { statusCode_3 as statusCode };
        const errorCode_3: string;
        export { errorCode_3 as errorCode };
    }
    namespace OTP_REGEN_ON_HALT_ERROR {
        const message_4: string;
        export { message_4 as message };
        const statusCode_4: number;
        export { statusCode_4 as statusCode };
        const errorCode_4: string;
        export { errorCode_4 as errorCode };
    }
    namespace OTP_GEN_EXCEEDED_ERROR {
        const message_5: string;
        export { message_5 as message };
        const statusCode_5: number;
        export { statusCode_5 as statusCode };
        const errorCode_5: string;
        export { errorCode_5 as errorCode };
    }
    namespace OTP_REGEN_EXCEEDED_ERROR {
        const message_6: string;
        export { message_6 as message };
        const statusCode_6: number;
        export { statusCode_6 as statusCode };
        const errorCode_6: string;
        export { errorCode_6 as errorCode };
    }
    namespace OTP_VAL_EXCEEDED_ERROR {
        const message_7: string;
        export { message_7 as message };
        const statusCode_7: number;
        export { statusCode_7 as statusCode };
        const errorCode_7: string;
        export { errorCode_7 as errorCode };
    }
}
