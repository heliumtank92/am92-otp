const HOTP_NOT_INITIALIZED_ERROR = {
  message: 'Hotp Not Initialized',
  statusCode: 500,
  errorCode: 'OtpError::HOTP_NOT_INITIALIZED'
}

const OTP_EXPIRED_ERROR = {
  message: 'Otp Expired',
  statusCode: 400,
  errorCode: 'OtpError::OTP_EXPIRED'
}

const OTP_REGEN_ON_HALT_ERROR = {
  message: 'Otp Generation On Halt',
  statusCode: 400,
  errorCode: 'OtpError::OTP_REGEN_ON_HALT'
}

const OTP_GEN_EXCEEDED_ERROR = {
  message: 'Otp Generation Exceeded',
  statusCode: 400,
  errorCode: 'OtpError::OTP_GEN_EXCEEDED'
}

const OTP_REGEN_EXCEEDED_ERROR = {
  message: 'Otp ReGeneration Exceeded',
  statusCode: 400,
  errorCode: 'OtpError::OTP_REGEN_EXCEEDED'
}

const OTP_VAL_EXCEEDED_ERROR = {
  message: 'Otp Validation Exceeded',
  statusCode: 400,
  errorCode: 'OtpError::OTP_VAL_EXCEEDED'
}

export {
  HOTP_NOT_INITIALIZED_ERROR,

  OTP_EXPIRED_ERROR,
  OTP_REGEN_ON_HALT_ERROR,
  OTP_GEN_EXCEEDED_ERROR,
  OTP_REGEN_EXCEEDED_ERROR,
  OTP_VAL_EXCEEDED_ERROR
}
