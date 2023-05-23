export default class Hotp extends Redis {
    generate(attrs?: {}): Promise<{
        referenceId: any;
        otp: any;
        regen: boolean;
    }>;
    validate(attrs?: {}): Promise<{
        referenceId: any;
        valid: boolean;
    }>;
    #private;
}
import Redis from './Redis.mjs';
