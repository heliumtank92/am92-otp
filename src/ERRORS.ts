import { OtpErrorMap } from './TYPES'

/** @ignore */
export const OTP_SDK_NOT_INITIALIZED_ERROR: OtpErrorMap = {
  message: 'OtpSdk Not Initialized',
  statusCode: 500,
  errorCode: 'Otp::HOTP_NOT_INITIALIZED'
}

/** @ignore */
export const INVALID_REF_ID_ERROR: OtpErrorMap = {
  message: 'Invalid Reference Id',
  statusCode: 400,
  errorCode: 'Otp::INVALID_REF_ID'
}

/** @ignore */
export const INVALID_REGEN_REF_ID_ERROR: OtpErrorMap = {
  message: 'Invalid Regeneration Reference Id',
  statusCode: 400,
  errorCode: 'Otp::INVALID_REGEN_REF_ID'
}

/** @ignore */
export const OTP_EXPIRED_ERROR: OtpErrorMap = {
  message: 'Otp Expired',
  statusCode: 400,
  errorCode: 'Otp::OTP_EXPIRED'
}

/** @ignore */
export const OTP_REGEN_ON_HALT_ERROR: OtpErrorMap = {
  message: 'Otp Generation On Halt',
  statusCode: 400,
  errorCode: 'Otp::OTP_REGEN_ON_HALT'
}

/** @ignore */
export const OTP_GEN_EXCEEDED_ERROR: OtpErrorMap = {
  message: 'Otp Generation Exceeded',
  statusCode: 400,
  errorCode: 'Otp::OTP_GEN_EXCEEDED'
}

/** @ignore */
export const OTP_REGEN_EXCEEDED_ERROR: OtpErrorMap = {
  message: 'Otp Regeneration Exceeded',
  statusCode: 400,
  errorCode: 'Otp::OTP_REGEN_EXCEEDED'
}

/** @ignore */
export const OTP_VAL_EXCEEDED_ERROR: OtpErrorMap = {
  message: 'Otp Validation Exceeded',
  statusCode: 400,
  errorCode: 'Otp::OTP_VAL_EXCEEDED'
}
