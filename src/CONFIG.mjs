const {
  OTP_ENABLED = 'false',
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

const ENABLED = OTP_ENABLED === 'true'
const AUTH_ENABLED = OTP_REDIS_AUTH_ENABLED === 'true'
const CHECK_SERVER_IDENTITY = OTP_REDIS_CHECK_SERVER_IDENTITY === 'true'

if (ENABLED) {
  let REQUIRED_CONFIG = ['OTP_REDIS_HOST', 'OTP_REDIS_PORT']

  if (AUTH_ENABLED) {
    REQUIRED_CONFIG = REQUIRED_CONFIG.concat(['OTP_REDIS_AUTH'])
  }

  // Terminate Server if any OTP Configuration is missing
  REQUIRED_CONFIG.forEach(function (key) {
    if (!process.env[key]) {
      console.error('[Error] Missing OTP Config:', key)
      return process.exit(1)
    }
  })
}

// Redis Configuration to required establish connection
const REDIS_CONNECTION_CONFIG = {
  host: OTP_REDIS_HOST,
  port: OTP_REDIS_PORT
}

if (AUTH_ENABLED) {
  REDIS_CONNECTION_CONFIG.password = OTP_REDIS_AUTH
}

if (CHECK_SERVER_IDENTITY) {
  REDIS_CONNECTION_CONFIG.tls = { checkServerIdentity: () => undefined }
}

const OTP_LENGTH_INT = parseInt(OTP_LENGTH, 10)
if (isNaN(OTP_LENGTH_INT)) {
  console.error('[Error] OTP Config OTP_LENGTH must be a valid Number:', OTP_LENGTH)
  process.exit(1)
}

const OTP_EXPIRY_IN_SECS_INT = parseInt(OTP_EXPIRY_IN_SECS, 10)
if (isNaN(OTP_EXPIRY_IN_SECS_INT)) {
  console.error('[Error] OTP Config OTP_EXPIRY_IN_SECS must be a valid Number:', OTP_EXPIRY_IN_SECS)
  process.exit(1)
}

const OTP_GEN_HALT_IN_SECS_INT = parseInt(OTP_GEN_HALT_IN_SECS, 10)
if (isNaN(OTP_GEN_HALT_IN_SECS_INT)) {
  console.error('[Error] OTP Config OTP_GEN_HALT_IN_SECS must be a valid Number:', OTP_GEN_HALT_IN_SECS)
  process.exit(1)
}

const OTP_GEN_LIMIT_INT = parseInt(OTP_GEN_LIMIT, 10)
if (isNaN(OTP_GEN_LIMIT_INT)) {
  console.error('[Error] OTP Config OTP_GEN_LIMIT must be a valid Number:', OTP_GEN_LIMIT)
  process.exit(1)
}

const OTP_GEN_LIMIT_EXPIRY_IN_SEC_INT = parseInt(OTP_GEN_LIMIT_EXPIRY_IN_SEC, 10)
if (isNaN(OTP_GEN_LIMIT_EXPIRY_IN_SEC_INT)) {
  console.error('[Error] OTP Config OTP_GEN_LIMIT_EXPIRY_IN_SEC must be a valid Number:', OTP_GEN_LIMIT_EXPIRY_IN_SEC)
  process.exit(1)
}

const OTP_REGEN_LIMIT_INT = parseInt(OTP_REGEN_LIMIT, 10)
if (isNaN(OTP_REGEN_LIMIT_INT)) {
  console.error('[Error] OTP Config OTP_REGEN_LIMIT must be a valid Number:', OTP_REGEN_LIMIT)
  process.exit(1)
}

const OTP_VAL_LIMIT_INT = parseInt(OTP_VAL_LIMIT, 10)
if (isNaN(OTP_VAL_LIMIT_INT)) {
  console.error('[Error] OTP Config OTP_VAL_LIMIT must be a valid Number:', OTP_VAL_LIMIT)
  process.exit(1)
}

const CONFIG = {
  ENABLED,

  REDIS_CONFIG: {
    CONNECTION_CONFIG: REDIS_CONNECTION_CONFIG,
    KEY_PREFIX: OTP_REDIS_KEY_PREFIX
  },

  PINPOINT_CONFIG: {
    APPLICATION_ID: OTP_PINPOINT_APPLICATION_ID,
    SMS_ORIGINATION_NUMBER: OTP_PINPOINT_SMS_ORIGINATION_NUMBER,
    SMS_SENDER_ID: OTP_PINPOINT_SMS_SENDER_ID,
    EMAIL_FROM_ADDRESS: OTP_PINPOINT_EMAIL_FROM_ADDRESS
  },

  OTP_CONFIG: {
    OTP_LENGTH: OTP_LENGTH_INT,
    OTP_EXPIRY_IN_SECS: OTP_EXPIRY_IN_SECS_INT,
    OTP_GEN_HALT_IN_SECS: OTP_GEN_HALT_IN_SECS_INT,
    OTP_GEN_LIMIT: OTP_GEN_LIMIT_INT,
    OTP_GEN_LIMIT_EXPIRY_IN_SEC: OTP_GEN_LIMIT_EXPIRY_IN_SEC_INT,
    OTP_REGEN_LIMIT: OTP_REGEN_LIMIT_INT,
    OTP_VAL_LIMIT: OTP_VAL_LIMIT_INT
  }
}

export default CONFIG
