import { RedisSdkConfig } from '@am92/redis'

/**
 * Type definition of HOTP Configurations
 *
 * @interface
 */
export interface OtpConfig {
  /**
   * Length of OTP
   */
  OTP_LENGTH: number
  /**
   * Expiry time of Generated OTP
   */
  OTP_EXPIRY_IN_SECS: number
  /**
   * Time rate limit between OTP generates
   */
  OTP_GEN_HALT_IN_SECS: number
  /**
   * OTP generation limit
   */
  OTP_GEN_LIMIT: number
  /**
   * Expiry time of `OTP_GEN_LIMIT` key
   */
  OTP_GEN_LIMIT_EXPIRY_IN_SEC: number
  /**
   * OTP re-generation limit
   */
  OTP_REGEN_LIMIT: number
  /**
   * OTP invalish attempt count
   */
  OTP_VAL_LIMIT: number
}

/**
 * Default HOTP Configurations
 */
export const DEFAULT_OTP_CONFIG: OtpConfig = {
  OTP_LENGTH: 6,
  OTP_EXPIRY_IN_SECS: 300,
  OTP_GEN_HALT_IN_SECS: 30,
  OTP_GEN_LIMIT: 5,
  OTP_GEN_LIMIT_EXPIRY_IN_SEC: 1800,
  OTP_REGEN_LIMIT: 3,
  OTP_VAL_LIMIT: 3
}

/**
 * Type definition of OtpSdk Configurations
 *
 * @interface
 */
export interface OtpSdkConfig {
  /**
   * Overriding RedisSdk Configurations
   */
  REDIS_CONFIG: RedisSdkConfig
  /**
   * HOTP Configurations
   */
  OTP_CONFIG: OtpConfig
}

/**
 * Type definition of input props for [OtpSdk.generate]{@link OtpSdk#generate}
 *
 * @interface
 */
export interface OtpGenerateProp {
  /**
   * Unique identifiers for which the OTP is generated
   */
  uids?: Array<string>
  /**
   * Previously generated reference Id value for which OTP needs to be re-generated
   */
  referenceId?: string
}

/**
 * Type definition of return value of [OtpSdk.generate]{@link OtpSdk#generate}
 *
 * @interface
 */
export interface OtpGenerateData {
  /**
   * Reference Id of the generated OTP
   */
  referenceId: string
  /**
   * Generated OTP
   */
  otp: string
  /**
   * Flag identifying whether OTP has been re-generated or generated first time
   */
  regen: boolean
}

/**
 * Type definition of input props for [OtpSdk.validate]{@link OtpSdk#validate}
 *
 * @interface
 */
export interface OtpValidateProp {
  /**
   * Reference Id of the OTP
   */
  referenceId: string
  /**
   * OTP to validate against
   */
  otp: string
}

/**
 * Type definition of return value of [OtpSdk.validate]{@link OtpSdk#validate}
 *
 * @interface
 */
export interface OtpValidateData {
  /**
   * Reference Id of the OTP
   */
  referenceId: string
  /**
   * Flag denoting whether validating OTP value is valid or not
   */
  valid: boolean
}

/**
 * Type defination for error map to be passed to OtpError.
 */
export interface OtpErrorMap {
  /**
   * Overriding message string for OtpError instance
   */
  message?: string
  /**
   * Overriding error code string for OtpError instance
   */
  errorCode?: string
  /**
   * Overriding HTTP status code for OtpError instance
   */
  statusCode?: number
}

declare global {
  /** @ignore */
  interface Console {
    success?(...data: any[]): void
    fatal?(...data: any[]): void
  }
}
