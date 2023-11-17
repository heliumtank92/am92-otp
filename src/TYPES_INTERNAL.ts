import { OtpSdkConfig } from './TYPES'

/** @ignore */
export interface OtpSdkEnvConfig extends OtpSdkConfig {
  DEDICATED_REDIS: boolean
}

/** @ignore */
export type IntConfigKeys =
  | 'OTP_REDIS_PORT'
  | 'OTP_LENGTH'
  | 'OTP_EXPIRY_IN_SECS'
  | 'OTP_GEN_HALT_IN_SECS'
  | 'OTP_GEN_LIMIT'
  | 'OTP_GEN_LIMIT_EXPIRY_IN_SEC'
  | 'OTP_REGEN_LIMIT'
  | 'OTP_VAL_LIMIT'

/** @ignore */
export type IntConfigs<T> = {
  [key in IntConfigKeys]?: T
}

/** @ignore */
export type OtpShouldGenerateData = {
  referenceId: string
  regen: boolean
}
