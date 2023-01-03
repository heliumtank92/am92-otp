"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _redis = _interopRequireDefault(require("@am92/redis"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
class Redis {
  constructor(REDIS_CONFIG, OTP_CONFIG) {
    this.redisSdk = new _redis.default(REDIS_CONFIG);
    this.OTP_CONFIG = OTP_CONFIG;
    this.initialize = this.initialize.bind(this);
    this.cacheOtp = this.cacheOtp.bind(this);
    this.getCachedOtp = this.getCachedOtp.bind(this);
    this.doesCacheExists = this.doesCacheExists.bind(this);
    this.setRegenHalt = this.setRegenHalt.bind(this);
    this.getRegenHalt = this.getRegenHalt.bind(this);
    this.setRegenCount = this.setRegenCount.bind(this);
    this.incRegenCount = this.incRegenCount.bind(this);
    this.doesGenCountExists = this.doesGenCountExists.bind(this);
    this.getGenCount = this.getGenCount.bind(this);
    this.setGenCount = this.setGenCount.bind(this);
    this.incGenCount = this.incGenCount.bind(this);
    this.getGenFor = this.getGenFor.bind(this);
    this.setGenFor = this.setGenFor.bind(this);
    this.setValidCount = this.setValidCount.bind(this);
    this.incValidCount = this.incValidCount.bind(this);
    this.clearKeys = this.clearKeys.bind(this);
  }
  initialize() {
    var _this = this;
    return _asyncToGenerator(function* () {
      yield _this.redisSdk.connect();
    })();
  }
  cacheOtp() {
    var _arguments = arguments,
      _this2 = this;
    return _asyncToGenerator(function* () {
      var ReferenceId = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : '';
      var Otp = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : '';
      var {
        OTP_CONFIG,
        redisSdk
      } = _this2;
      var {
        OTP_EXPIRY_IN_SECS
      } = OTP_CONFIG;
      var redisKey = "OTP_".concat(ReferenceId, "_OTP");
      return redisSdk.setAndExpire(redisKey, Otp, OTP_EXPIRY_IN_SECS);
    })();
  }
  getCachedOtp() {
    var _arguments2 = arguments,
      _this3 = this;
    return _asyncToGenerator(function* () {
      var ReferenceId = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : '';
      var {
        redisSdk
      } = _this3;
      var redisKey = "OTP_".concat(ReferenceId, "_OTP");
      return redisSdk.get(redisKey);
    })();
  }
  doesCacheExists() {
    var _arguments3 = arguments,
      _this4 = this;
    return _asyncToGenerator(function* () {
      var ReferenceId = _arguments3.length > 0 && _arguments3[0] !== undefined ? _arguments3[0] : '';
      var {
        redisSdk
      } = _this4;
      var redisKey = "OTP_".concat(ReferenceId, "_OTP");
      return redisSdk.exists(redisKey);
    })();
  }
  setRegenHalt() {
    var _arguments4 = arguments,
      _this5 = this;
    return _asyncToGenerator(function* () {
      var ReferenceId = _arguments4.length > 0 && _arguments4[0] !== undefined ? _arguments4[0] : '';
      var {
        OTP_CONFIG,
        redisSdk
      } = _this5;
      var {
        OTP_GEN_HALT_IN_SECS
      } = OTP_CONFIG;
      var redisKey = "OTP_".concat(ReferenceId, "_REGEN_HALT");
      return redisSdk.setAndExpire(redisKey, 1, OTP_GEN_HALT_IN_SECS);
    })();
  }
  getRegenHalt() {
    var _arguments5 = arguments,
      _this6 = this;
    return _asyncToGenerator(function* () {
      var ReferenceId = _arguments5.length > 0 && _arguments5[0] !== undefined ? _arguments5[0] : '';
      var {
        redisSdk
      } = _this6;
      var redisKey = "OTP_".concat(ReferenceId, "_REGEN_HALT");
      return redisSdk.get(redisKey);
    })();
  }
  setRegenCount() {
    var _arguments6 = arguments,
      _this7 = this;
    return _asyncToGenerator(function* () {
      var ReferenceId = _arguments6.length > 0 && _arguments6[0] !== undefined ? _arguments6[0] : '';
      var {
        OTP_CONFIG,
        redisSdk
      } = _this7;
      var {
        OTP_EXPIRY_IN_SECS
      } = OTP_CONFIG;
      var redisKey = "OTP_".concat(ReferenceId, "_REGEN_CT");
      return redisSdk.setAndExpire(redisKey, 0, OTP_EXPIRY_IN_SECS);
    })();
  }
  incRegenCount() {
    var _arguments7 = arguments,
      _this8 = this;
    return _asyncToGenerator(function* () {
      var ReferenceId = _arguments7.length > 0 && _arguments7[0] !== undefined ? _arguments7[0] : '';
      var {
        OTP_CONFIG,
        redisSdk
      } = _this8;
      var {
        OTP_EXPIRY_IN_SECS
      } = OTP_CONFIG;
      var redisKey = "OTP_".concat(ReferenceId, "_REGEN_CT");
      return redisSdk.incrByAndExpire(redisKey, 1, OTP_EXPIRY_IN_SECS);
    })();
  }
  doesGenCountExists() {
    var _arguments8 = arguments,
      _this9 = this;
    return _asyncToGenerator(function* () {
      var Uid = _arguments8.length > 0 && _arguments8[0] !== undefined ? _arguments8[0] : '';
      var {
        redisSdk
      } = _this9;
      var redisKey = "OTP_".concat(Uid, "_GEN_CT");
      return redisSdk.exists(redisKey);
    })();
  }
  getGenCount() {
    var _arguments9 = arguments,
      _this10 = this;
    return _asyncToGenerator(function* () {
      var Uid = _arguments9.length > 0 && _arguments9[0] !== undefined ? _arguments9[0] : '';
      var {
        redisSdk
      } = _this10;
      var redisKey = "OTP_".concat(Uid, "_GEN_CT");
      return redisSdk.get(redisKey);
    })();
  }
  setGenCount() {
    var _arguments10 = arguments,
      _this11 = this;
    return _asyncToGenerator(function* () {
      var Uid = _arguments10.length > 0 && _arguments10[0] !== undefined ? _arguments10[0] : '';
      var {
        OTP_CONFIG,
        redisSdk
      } = _this11;
      var {
        OTP_GEN_LIMIT_EXPIRY_IN_SEC
      } = OTP_CONFIG;
      var redisKey = "OTP_".concat(Uid, "_GEN_CT");
      return redisSdk.setAndExpire(redisKey, 1, OTP_GEN_LIMIT_EXPIRY_IN_SEC);
    })();
  }
  incGenCount() {
    var _arguments11 = arguments,
      _this12 = this;
    return _asyncToGenerator(function* () {
      var Uid = _arguments11.length > 0 && _arguments11[0] !== undefined ? _arguments11[0] : '';
      var {
        OTP_CONFIG,
        redisSdk
      } = _this12;
      var {
        OTP_GEN_LIMIT_EXPIRY_IN_SEC
      } = OTP_CONFIG;
      var redisKey = "OTP_".concat(Uid, "_GEN_CT");
      return redisSdk.incrByAndExpire(redisKey, 1, OTP_GEN_LIMIT_EXPIRY_IN_SEC);
    })();
  }
  getGenFor() {
    var _arguments12 = arguments,
      _this13 = this;
    return _asyncToGenerator(function* () {
      var ReferenceId = _arguments12.length > 0 && _arguments12[0] !== undefined ? _arguments12[0] : '';
      var {
        redisSdk
      } = _this13;
      var redisKey = "OTP_".concat(ReferenceId, "_GEN_FOR");
      return redisSdk.get(redisKey);
    })();
  }
  setGenFor() {
    var _arguments13 = arguments,
      _this14 = this;
    return _asyncToGenerator(function* () {
      var ReferenceId = _arguments13.length > 0 && _arguments13[0] !== undefined ? _arguments13[0] : '';
      var UidString = _arguments13.length > 1 && _arguments13[1] !== undefined ? _arguments13[1] : '';
      var {
        OTP_CONFIG,
        redisSdk
      } = _this14;
      var {
        OTP_GEN_LIMIT_EXPIRY_IN_SEC
      } = OTP_CONFIG;
      var redisKey = "OTP_".concat(ReferenceId, "_GEN_FOR");
      return redisSdk.setAndExpire(redisKey, UidString, OTP_GEN_LIMIT_EXPIRY_IN_SEC);
    })();
  }
  setValidCount() {
    var _arguments14 = arguments,
      _this15 = this;
    return _asyncToGenerator(function* () {
      var ReferenceId = _arguments14.length > 0 && _arguments14[0] !== undefined ? _arguments14[0] : '';
      var {
        OTP_CONFIG,
        redisSdk
      } = _this15;
      var {
        OTP_EXPIRY_IN_SECS
      } = OTP_CONFIG;
      var redisKey = "OTP_".concat(ReferenceId, "_VAL_CT");
      return redisSdk.setAndExpire(redisKey, 0, OTP_EXPIRY_IN_SECS);
    })();
  }
  incValidCount() {
    var _arguments15 = arguments,
      _this16 = this;
    return _asyncToGenerator(function* () {
      var ReferenceId = _arguments15.length > 0 && _arguments15[0] !== undefined ? _arguments15[0] : '';
      var {
        OTP_CONFIG,
        redisSdk
      } = _this16;
      var {
        OTP_EXPIRY_IN_SECS
      } = OTP_CONFIG;
      var redisKey = "OTP_".concat(ReferenceId, "_VAL_CT");
      return redisSdk.incrByAndExpire(redisKey, 1, OTP_EXPIRY_IN_SECS);
    })();
  }
  clearKeys() {
    var _arguments16 = arguments,
      _this17 = this;
    return _asyncToGenerator(function* () {
      var ReferenceId = _arguments16.length > 0 && _arguments16[0] !== undefined ? _arguments16[0] : '';
      var {
        redisSdk
      } = _this17;
      var UidsString = (yield _this17.getGenFor(ReferenceId)) || '';
      var Uids = UidsString.split(',');
      for (var Uid of Uids) {
        var _redisKey = "OTP_".concat(Uid, "_*");
        yield redisSdk.delByPattern(_redisKey);
      }
      var redisKey = "OTP_".concat(ReferenceId, "_*");
      return redisSdk.delByPattern(redisKey);
    })();
  }
}
exports.default = Redis;