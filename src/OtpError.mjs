import { SERVICE } from './CONFIG.mjs'

const DEFAULT_ERROR_MSG = 'Api Crypto Error'
const DEFAULT_ERROR_STATUS_CODE = 500
const DEFAULT_ERROR_CODE = 'API_CRYPTO_ERROR'
export default class OtpError extends Error {
  constructor (e = {}, eMap) {
    if (e._isCustomError && !eMap) { return e }

    super()

    const { message, statusCode, errorCode } = eMap || {}
    const {
      message: eMessage,
      msg: eMsg,
      statusCode: eStatusCode,
      errorCode: eErrorCode,
      code: eCode
    } = e

    this._isCustomError = true
    this._isOtpError = true
    this.service = SERVICE
    this.message = message || eMessage || eMsg || DEFAULT_ERROR_MSG
    this.statusCode = statusCode || eStatusCode || DEFAULT_ERROR_STATUS_CODE
    this.errorCode = errorCode || eErrorCode || eCode || DEFAULT_ERROR_CODE
    this.error = e
  }
}
