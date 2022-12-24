const OTP_EXPIRED = {
  message: 'Otp Expired',
  statusCode: 400,
  code: 'OTP_EXPIRED'
}

const OTP_REGEN_ON_HALT = {
  message: 'Otp Generation On Halt',
  statusCode: 400,
  code: 'OTP_REGEN_ON_HALT'
}

const OTP_GEN_EXCEEDED = {
  message: 'Otp Generation Exceeded',
  statusCode: 400,
  code: 'OTP_GEN_EXCEEDED'
}

const OTP_REGEN_EXCEEDED = {
  message: 'Otp ReGeneration Exceeded',
  statusCode: 400,
  code: 'OTP_REGEN_EXCEEDED'
}

const OTP_VAL_EXCEEDED = {
  message: 'Otp Validation Exceeded',
  statusCode: 400,
  code: 'OTP_VAL_EXCEEDED'
}

const INVALID_REGEN_OTP_PROP = {
  message: 'Invalid Regenerate Otp Prop',
  statusCode: 400,
  code: 'INVALID_REGEN_OTP_PROP'
}

export {
  OTP_EXPIRED,
  OTP_REGEN_ON_HALT,
  OTP_GEN_EXCEEDED,
  OTP_REGEN_EXCEEDED,
  OTP_VAL_EXCEEDED,

  INVALID_REGEN_OTP_PROP
}
