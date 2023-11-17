import { RedisSdkConfig } from '@am92/redis'
import { DEFAULT_OTP_CONFIG } from './TYPES'
import { IntConfigKeys, IntConfigs, OtpSdkEnvConfig } from './TYPES_INTERNAL'

/** @ignore */
const {
  npm_package_name: pkgName = '',
  npm_package_version: pkgVersion = '',

  OTP_DEDICATED_REDIS = 'false',
  OTP_REDIS_AUTH_ENABLED = 'false',
  OTP_REDIS_HOST = '',
  OTP_REDIS_PORT = '6379',
  OTP_REDIS_AUTH = '',
  OTP_REDIS_KEY_PREFIX = '',

  OTP_LENGTH = DEFAULT_OTP_CONFIG.OTP_LENGTH.toString(),
  OTP_EXPIRY_IN_SECS = DEFAULT_OTP_CONFIG.OTP_EXPIRY_IN_SECS.toString(),
  OTP_GEN_HALT_IN_SECS = DEFAULT_OTP_CONFIG.OTP_GEN_HALT_IN_SECS.toString(),
  OTP_GEN_LIMIT = DEFAULT_OTP_CONFIG.OTP_GEN_LIMIT.toString(),
  OTP_GEN_LIMIT_EXPIRY_IN_SEC = DEFAULT_OTP_CONFIG.OTP_GEN_LIMIT_EXPIRY_IN_SEC.toString(),
  OTP_REGEN_LIMIT = DEFAULT_OTP_CONFIG.OTP_REGEN_LIMIT.toString(),
  OTP_VAL_LIMIT = DEFAULT_OTP_CONFIG.OTP_VAL_LIMIT.toString()
} = process.env

/** @ignore */
export const SERVICE = `${pkgName}@${pkgVersion}`

/** @ignore */
const DEDICATED_REDIS = OTP_DEDICATED_REDIS === 'true'

/** @ignore */
const DEDICATED_REDIS_AUTH_ENABLED = OTP_REDIS_AUTH_ENABLED === 'true'

/** @ignore */
let REDIS_CONNECTION_CONFIG: RedisSdkConfig['CONNECTION_CONFIG'] = {}

/** @ignore */
const REQUIRED_CONFIG: Array<string> = []

/** @ignore */
const MISSING_CONFIGS: Array<string> = []

/** @ignore */
const INT_ENV: IntConfigs<string> = {
  OTP_REDIS_PORT,
  OTP_LENGTH,
  OTP_EXPIRY_IN_SECS,
  OTP_GEN_HALT_IN_SECS,
  OTP_GEN_LIMIT,
  OTP_GEN_LIMIT_EXPIRY_IN_SEC,
  OTP_REGEN_LIMIT,
  OTP_VAL_LIMIT
}

/** @ignore */
const INT_CONFIG: IntConfigs<number> = {}

/** @ignore */
const INVALID_INT_CONFIG: IntConfigs<string> = {}

if (DEDICATED_REDIS) {
  REQUIRED_CONFIG.push('OTP_REDIS_HOST')
  REQUIRED_CONFIG.push('OTP_REDIS_PORT')

  if (DEDICATED_REDIS_AUTH_ENABLED) {
    REQUIRED_CONFIG.push('OTP_REDIS_AUTH')
  }

  REQUIRED_CONFIG.forEach(function (key) {
    if (!process.env[key]) {
      MISSING_CONFIGS.push(key)
    }
  })

  if (MISSING_CONFIGS.length) {
    const logFunc = console.fatal || console.error
    logFunc(
      `[${SERVICE} Otp] Otp Configs Missing: ${MISSING_CONFIGS.join(', ')}`
    )
    process.exit(1)
  }
} else {
  console.warn(
    `[${SERVICE} Otp] Otp Config OTP_DEDICATED_REDIS set to false. Ensure REDIS_ENABLED is set to true`
  )
}

Object.keys(INT_ENV).forEach(key => {
  const configKey = key as IntConfigKeys
  const value = INT_ENV[configKey] || ''
  const intValue = parseInt(value, 10)

  if (isNaN(intValue)) {
    INVALID_INT_CONFIG[configKey] = value
  } else {
    INT_CONFIG[configKey] = intValue
  }
})

if (Object.keys(INVALID_INT_CONFIG).length) {
  const logFunc = console.fatal || console.error
  logFunc(`[${SERVICE} Otp] Invalid Otp Integer Configs:`, INVALID_INT_CONFIG)
  process.exit(1)
}

if (DEDICATED_REDIS) {
  REDIS_CONNECTION_CONFIG = {
    socket: {
      host: OTP_REDIS_HOST,
      port: INT_CONFIG.OTP_REDIS_PORT,
      tls: DEDICATED_REDIS_AUTH_ENABLED
    },
    password: DEDICATED_REDIS_AUTH_ENABLED ? OTP_REDIS_AUTH : undefined
  }
}

/** @ignore */
const CONFIG: OtpSdkEnvConfig = {
  DEDICATED_REDIS,

  REDIS_CONFIG: {
    CONNECTION_CONFIG: REDIS_CONNECTION_CONFIG,
    KEY_PREFIX: OTP_REDIS_KEY_PREFIX
  },

  OTP_CONFIG: {
    OTP_LENGTH: INT_CONFIG.OTP_LENGTH || DEFAULT_OTP_CONFIG.OTP_LENGTH,
    OTP_EXPIRY_IN_SECS:
      INT_CONFIG.OTP_EXPIRY_IN_SECS || DEFAULT_OTP_CONFIG.OTP_EXPIRY_IN_SECS,
    OTP_GEN_HALT_IN_SECS:
      INT_CONFIG.OTP_GEN_HALT_IN_SECS ||
      DEFAULT_OTP_CONFIG.OTP_GEN_HALT_IN_SECS,
    OTP_GEN_LIMIT: INT_CONFIG.OTP_GEN_LIMIT || DEFAULT_OTP_CONFIG.OTP_GEN_LIMIT,
    OTP_GEN_LIMIT_EXPIRY_IN_SEC:
      INT_CONFIG.OTP_GEN_LIMIT_EXPIRY_IN_SEC ||
      DEFAULT_OTP_CONFIG.OTP_GEN_LIMIT_EXPIRY_IN_SEC,
    OTP_REGEN_LIMIT:
      INT_CONFIG.OTP_REGEN_LIMIT || DEFAULT_OTP_CONFIG.OTP_REGEN_LIMIT,
    OTP_VAL_LIMIT: INT_CONFIG.OTP_VAL_LIMIT || DEFAULT_OTP_CONFIG.OTP_VAL_LIMIT
  }
}

export default CONFIG
