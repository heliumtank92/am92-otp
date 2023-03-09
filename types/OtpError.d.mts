export default class OtpError extends Error {
    constructor(e: {}, eMap: any);
    _isCustomError: boolean;
    _isOtpError: boolean;
    service: string;
    message: any;
    statusCode: any;
    errorCode: any;
    error: {};
}
