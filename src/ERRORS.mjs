const ERRORS = {
  HOTP_NOT_INITIALIZED_ERROR: {
    message: 'Hotp Not Initialized',
    statusCode: 500,
    errorCode: 'Otp::HOTP_NOT_INITIALIZED'
  },

  INVALID_REF_ID_ERROR: {
    message: 'Invalid Reference Id',
    statusCode: 400,
    errorCode: 'Otp::INVALID_REF_ID'
  },

  INVALID_REGEN_REF_ID_ERROR: {
    message: 'Invalid Regeneration Reference Id',
    statusCode: 400,
    errorCode: 'Otp::INVALID_REGEN_REF_ID'
  },

  OTP_EXPIRED_ERROR: {
    message: 'Otp Expired',
    statusCode: 400,
    errorCode: 'Otp::OTP_EXPIRED'
  },

  OTP_REGEN_ON_HALT_ERROR: {
    message: 'Otp Generation On Halt',
    statusCode: 400,
    errorCode: 'Otp::OTP_REGEN_ON_HALT'
  },

  OTP_GEN_EXCEEDED_ERROR: {
    message: 'Otp Generation Exceeded',
    statusCode: 400,
    errorCode: 'Otp::OTP_GEN_EXCEEDED'
  },

  OTP_REGEN_EXCEEDED_ERROR: {
    message: 'Otp Regeneration Exceeded',
    statusCode: 400,
    errorCode: 'Otp::OTP_REGEN_EXCEEDED'
  },

  OTP_VAL_EXCEEDED_ERROR: {
    message: 'Otp Validation Exceeded',
    statusCode: 400,
    errorCode: 'Otp::OTP_VAL_EXCEEDED'
  }
}

export default ERRORS
