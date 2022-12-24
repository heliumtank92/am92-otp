export default class OtpError {
  constructor (err) {
    const {
      _isOtpError = false,
      message = 'Unhandled Error',
      statusCode = 500,
      code = 'OTP_UNHANDLED_ERROR',
      error
    } = err

    if (_isOtpError) { return err }

    this._isOtpError = true
    this.message = message
    this.statusCode = statusCode
    this.code = code
    this.error = error
  }

  toJSON () {
    const { message, statusCode, error } = this
    return { message, statusCode, error }
  }

  static buildFromErrorMap (errorMap, error) {
    if (error._isOtpError) { return error }

    const { message, statusCode, code } = errorMap
    const err = (error.toJSON && error.toJSON()) || error

    const errorAttrs = { message, statusCode, code, error: err }
    const otpError = new OtpError(errorAttrs)
    return otpError
  }
}
