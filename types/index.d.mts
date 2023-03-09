export default class OtpSdk {
    constructor(config?: {});
    CONFIG: any;
    initialize(): Promise<void>;
    generateHotp: (attrs?: {}) => Promise<{
        referenceId: any;
        otp: any;
        regen: boolean;
    }>;
    validateHotp: (attrs?: {}) => Promise<{
        referenceId: any;
        valid: boolean;
    }>;
    #private;
}
