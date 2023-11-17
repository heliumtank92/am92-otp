import { SERVICE } from './CONFIG'
import { OtpErrorMap } from './TYPES'

/** @ignore */
const DEFAULT_ERROR_MSG = 'OTP Error'
/** @ignore */
const DEFAULT_ERROR_STATUS_CODE = 500
/** @ignore */
const DEFAULT_ERROR_CODE = 'Otp::GENERIC'

/**
 * Error class whose instance is thrown in case of any error.
 *
 * @class
 * @typedef {OtpError}
 * @extends {Error}
 */
export class OtpError extends Error {
  /**
   * Flag to identify if error is a custom error.
   */
  readonly _isCustomError = true
  /**
   * Flag to identify if error is a OtpError.
   */
  readonly _isOtpError = true
  /**
   * Node project from which Error is thrown.
   */
  readonly service: string
  /**
   * Error's message string.
   */
  message: string
  /**
   * HTTP status code associated with the error.
   */
  statusCode: number
  /**
   * Error Code.
   */
  errorCode: string
  /**
   * Error object.
   */
  error?: any
  /**
   * Creates an instance of OtpError.
   *
   * @constructor
   * @param [e] Any Error instance to wrap with OtpError.
   * @param [eMap] OtpErrorMap to rewrap error for better understanding.
   */
  constructor(e?: any, eMap?: OtpErrorMap) {
    super()

    this.service = SERVICE
    this.message = eMap?.message || e?.message || DEFAULT_ERROR_MSG
    this.statusCode = eMap?.statusCode || DEFAULT_ERROR_STATUS_CODE
    this.errorCode = eMap?.errorCode || e?.code || DEFAULT_ERROR_CODE
    this.error = e
  }
}
