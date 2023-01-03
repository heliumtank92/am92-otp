"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OTP_VAL_EXCEEDED_ERROR = exports.OTP_REGEN_ON_HALT_ERROR = exports.OTP_REGEN_EXCEEDED_ERROR = exports.OTP_GEN_EXCEEDED_ERROR = exports.OTP_EXPIRED_ERROR = void 0;
var OTP_EXPIRED_ERROR = {
  message: 'Otp Expired',
  statusCode: 400,
  errorCode: 'OtpError::OTP_EXPIRED'
};
exports.OTP_EXPIRED_ERROR = OTP_EXPIRED_ERROR;
var OTP_REGEN_ON_HALT_ERROR = {
  message: 'Otp Generation On Halt',
  statusCode: 400,
  errorCode: 'OtpError::OTP_REGEN_ON_HALT'
};
exports.OTP_REGEN_ON_HALT_ERROR = OTP_REGEN_ON_HALT_ERROR;
var OTP_GEN_EXCEEDED_ERROR = {
  message: 'Otp Generation Exceeded',
  statusCode: 400,
  errorCode: 'OtpError::OTP_GEN_EXCEEDED'
};
exports.OTP_GEN_EXCEEDED_ERROR = OTP_GEN_EXCEEDED_ERROR;
var OTP_REGEN_EXCEEDED_ERROR = {
  message: 'Otp ReGeneration Exceeded',
  statusCode: 400,
  errorCode: 'OtpError::OTP_REGEN_EXCEEDED'
};
exports.OTP_REGEN_EXCEEDED_ERROR = OTP_REGEN_EXCEEDED_ERROR;
var OTP_VAL_EXCEEDED_ERROR = {
  message: 'Otp Validation Exceeded',
  statusCode: 400,
  errorCode: 'OtpError::OTP_VAL_EXCEEDED'
};
exports.OTP_VAL_EXCEEDED_ERROR = OTP_VAL_EXCEEDED_ERROR;