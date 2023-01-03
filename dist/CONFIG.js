"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var {
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
} = process.env;
var DEDICATED_REDIS = OTP_DEDICATED_REDIS === 'true';
var REDIS_CONNECTION_CONFIG;
var REQUIRED_CONFIG = [];
var MISSING_CONFIGS = [];
var INVALID_CONFIGS = [];
var INT_CONFIGS = {
  OTP_LENGTH,
  OTP_EXPIRY_IN_SECS,
  OTP_GEN_HALT_IN_SECS,
  OTP_GEN_LIMIT,
  OTP_GEN_LIMIT_EXPIRY_IN_SEC,
  OTP_REGEN_LIMIT,
  OTP_VAL_LIMIT
};
if (DEDICATED_REDIS) {
  REQUIRED_CONFIG.push('OTP_REDIS_HOST');
  REQUIRED_CONFIG.push('OTP_REDIS_PORT');
  var AUTH_ENABLED = OTP_REDIS_AUTH_ENABLED === 'true';
  var CHECK_SERVER_IDENTITY = OTP_REDIS_CHECK_SERVER_IDENTITY === 'true';
  if (AUTH_ENABLED) {
    REQUIRED_CONFIG.push('OTP_REDIS_AUTH');
  }
  REQUIRED_CONFIG.forEach(function (key) {
    if (!process.env[key]) {
      MISSING_CONFIGS.push(key);
    }
  });
  if (MISSING_CONFIGS.length) {
    console.error("Missing OTP Configs: ".concat(MISSING_CONFIGS));
    process.exit(1);
  }
  REDIS_CONNECTION_CONFIG = {
    host: OTP_REDIS_HOST,
    port: OTP_REDIS_PORT
  };
  if (AUTH_ENABLED) {
    REDIS_CONNECTION_CONFIG.password = OTP_REDIS_AUTH;
  }
  if (CHECK_SERVER_IDENTITY) {
    REDIS_CONNECTION_CONFIG.tls = {
      checkServerIdentity: () => undefined
    };
  }
}
Object.keys(INT_CONFIGS).forEach(key => {
  var value = INT_CONFIGS[key];
  INT_CONFIGS[key] = parseInt(value, 10);
  if (isNaN(INT_CONFIGS[key])) {
    INVALID_CONFIGS.push("Invalid OTP Config ".concat(key, ". Must be a valid Number: ").concat(value));
  }
});
if (INVALID_CONFIGS.length) {
  INVALID_CONFIGS.map(console.error);
  process.exit(1);
}
var CONFIG = {
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
};
var _default = CONFIG;
exports.default = _default;