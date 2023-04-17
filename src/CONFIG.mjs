const {
  npm_package_name: pkgName = '',
  npm_package_version: pkgVersion = '',

  OTP_DEDICATED_REDIS = 'false',
  OTP_REDIS_AUTH_ENABLED = 'false',
  OTP_REDIS_CHECK_SERVER_IDENTITY = 'false',
  OTP_REDIS_HOST = '',
  OTP_REDIS_PORT = '',
  OTP_REDIS_KEY_PREFIX = '',
  OTP_REDIS_AUTH = '',

  OTP_LENGTH = '6',
  OTP_EXPIRY_IN_SECS = '300',
  OTP_GEN_HALT_IN_SECS = '30',
  OTP_GEN_LIMIT = '5',
  OTP_GEN_LIMIT_EXPIRY_IN_SEC = '1800',
  OTP_REGEN_LIMIT = '3',
  OTP_VAL_LIMIT = '3'
} = process.env

const SERVICE = `${pkgName}@${pkgVersion}`

const DEDICATED_REDIS = OTP_DEDICATED_REDIS === 'true'
let REDIS_CONNECTION_CONFIG

const REQUIRED_CONFIG = []
const MISSING_CONFIGS = []
const INT_CONFIGS = {
  OTP_LENGTH,
  OTP_EXPIRY_IN_SECS,
  OTP_GEN_HALT_IN_SECS,
  OTP_GEN_LIMIT,
  OTP_GEN_LIMIT_EXPIRY_IN_SEC,
  OTP_REGEN_LIMIT,
  OTP_VAL_LIMIT
}
const INVALID_INT_CONFIG = {}

if (DEDICATED_REDIS) {
  REQUIRED_CONFIG.push('OTP_REDIS_HOST')
  REQUIRED_CONFIG.push('OTP_REDIS_PORT')

  const AUTH_ENABLED = OTP_REDIS_AUTH_ENABLED === 'true'
  const CHECK_SERVER_IDENTITY = OTP_REDIS_CHECK_SERVER_IDENTITY === 'true'

  if (AUTH_ENABLED) {
    REQUIRED_CONFIG.push('OTP_REDIS_AUTH')
  }

  REQUIRED_CONFIG.forEach(function (key) {
    if (!process.env[key]) {
      MISSING_CONFIGS.push(key)
    }
  })

  if (MISSING_CONFIGS.length) {
    const logFunc = console.fatal || console.error
    logFunc(`[${SERVICE} Otp] Otp Configs Missing: ${MISSING_CONFIGS.join(', ')}`)
    process.exit(1)
  }

  REDIS_CONNECTION_CONFIG = {
    socket: {
      host: OTP_REDIS_HOST,
      port: OTP_REDIS_PORT
    }
  }

  if (AUTH_ENABLED) {
    REDIS_CONNECTION_CONFIG.password = OTP_REDIS_AUTH
  }

  if (CHECK_SERVER_IDENTITY) {
    REDIS_CONNECTION_CONFIG.tls = { checkServerIdentity: () => undefined }
  }
} else {
  console.warn(`[${SERVICE} Otp] Otp Config OTP_DEDICATED_REDIS set to false. Ensure REDIS_ENABLED is set to true`)
}

Object.keys(INT_CONFIGS).forEach(key => {
  const value = INT_CONFIGS[key]
  INT_CONFIGS[key] = parseInt(value, 10)

  if (isNaN(INT_CONFIGS[key])) {
    INVALID_INT_CONFIG[key] = value
  }
})

if (Object.keys(INVALID_INT_CONFIG).length) {
  const logFunc = console.fatal || console.error
  logFunc(`[${SERVICE} Otp] Invalid Otp Integer Configs:`, INVALID_INT_CONFIG)
  process.exit(1)
}

const CONFIG = {
  DEDICATED_REDIS,

  REDIS_CONFIG: {
    CONNECTION_CONFIG: REDIS_CONNECTION_CONFIG,
    KEY_PREFIX: OTP_REDIS_KEY_PREFIX
  },

  OTP_CONFIG: {
    OTP_LENGTH: INT_CONFIGS.OTP_LENGTH,
    OTP_EXPIRY_IN_SECS: INT_CONFIGS.OTP_EXPIRY_IN_SECS,
    OTP_GEN_HALT_IN_SECS: INT_CONFIGS.OTP_GEN_HALT_IN_SECS,
    OTP_GEN_LIMIT: INT_CONFIGS.OTP_GEN_LIMIT,
    OTP_GEN_LIMIT_EXPIRY_IN_SEC: INT_CONFIGS.OTP_GEN_LIMIT_EXPIRY_IN_SEC,
    OTP_REGEN_LIMIT: INT_CONFIGS.OTP_REGEN_LIMIT,
    OTP_VAL_LIMIT: INT_CONFIGS.OTP_VAL_LIMIT
  }
}

export default CONFIG

export { SERVICE }
