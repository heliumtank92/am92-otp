"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
var _lodash = _interopRequireDefault(require("lodash"));
var _Redis = _interopRequireDefault(require("./Redis.js"));
var _OtpError = _interopRequireDefault(require("../OtpError.js"));
var _ERRORS = require("../constants/ERRORS.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
var _shouldGenerate = /*#__PURE__*/new WeakSet();
var _generateHotp = /*#__PURE__*/new WeakSet();
var _shouldValidate = /*#__PURE__*/new WeakSet();
class Hotp extends _Redis.default {
  constructor(REDIS_CONFIG, _OTP_CONFIG) {
    super(REDIS_CONFIG, _OTP_CONFIG);
    _classPrivateMethodInitSpec(this, _shouldValidate);
    _classPrivateMethodInitSpec(this, _generateHotp);
    _classPrivateMethodInitSpec(this, _shouldGenerate);
    this.generate = this.generate.bind(this);
    this.validate = this.validate.bind(this);
  }
  generate() {
    var _arguments = arguments,
      _this = this;
    return _asyncToGenerator(function* () {
      var attrs = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : {};
      var {
        Uids = []
      } = attrs;

      // Validate Generation and Get ReferenceId
      var {
        ReferenceId,
        Regen = false
      } = yield _classPrivateMethodGet(_this, _shouldGenerate, _shouldGenerate2).call(_this, attrs);

      // Generate HOTP
      var Otp = _classPrivateMethodGet(_this, _generateHotp, _generateHotp2).call(_this);

      // Manage Redis Keys
      var promises = [_this.cacheOtp(ReferenceId, Otp), _this.setRegenHalt(ReferenceId)];
      if (Regen) {
        promises.push(_this.setRegenCount(ReferenceId));
        promises.push(_this.setValidCount(ReferenceId));
        promises.push(_this.setGenFor(ReferenceId, Uids.toString()));
      }
      yield Promise.allSettled(promises);

      // Return Generated Otp
      return {
        ReferenceId,
        Otp,
        Regen
      };
    })();
  }
  validate() {
    var _arguments2 = arguments,
      _this2 = this;
    return _asyncToGenerator(function* () {
      var attrs = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : {};
      // Validate Validation and Get Cached Otp
      var cachedOtp = yield _classPrivateMethodGet(_this2, _shouldValidate, _shouldValidate2).call(_this2, attrs);
      var {
        ReferenceId,
        Otp
      } = attrs;
      var Valid = Otp === cachedOtp;

      // Handle Otp Validations After Sending Response
      if (Valid) {
        yield _this2.clearKeys(ReferenceId);
      }
      return {
        ReferenceId,
        Valid
      };
    })();
  }
}
exports.default = Hotp;
function _shouldGenerate2() {
  return _shouldGenerate3.apply(this, arguments);
}
function _shouldGenerate3() {
  _shouldGenerate3 = _asyncToGenerator(function* () {
    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
      OTP_CONFIG
    } = this;
    var {
      OTP_GEN_LIMIT,
      OTP_REGEN_LIMIT
    } = OTP_CONFIG;
    var {
      ReferenceId,
      Uids
    } = attrs;

    // Validate Generate Count
    for (var Uid of Uids) {
      var _generateCount = yield this.incGenCount(Uid);
      if (_generateCount > OTP_GEN_LIMIT) {
        throw new _OtpError.default(attrs, _ERRORS.OTP_GEN_EXCEEDED_ERROR);
      }
    }

    // Generate New ReferenceId If Not Provide or Not Cached
    if (!ReferenceId) {
      return {
        ReferenceId: _crypto.default.randomUUID()
      };
    }
    var doesCacheExists = yield this.doesCacheExists(ReferenceId);
    if (!doesCacheExists) {
      return {
        ReferenceId
      };
    }

    // Validate ReGenerate Halt
    var shouldHalt = yield this.getRegenHalt(ReferenceId);
    if (shouldHalt) {
      throw new _OtpError.default(attrs, _ERRORS.OTP_REGEN_ON_HALT_ERROR);
    }

    // Validate ReGenerate Count
    var generateCount = yield this.incRegenCount(ReferenceId);
    if (generateCount > OTP_REGEN_LIMIT) {
      throw new _OtpError.default(attrs, _ERRORS.OTP_REGEN_EXCEEDED_ERROR);
    }

    // Return RefereceId
    return {
      ReferenceId,
      Regen: true
    };
  });
  return _shouldGenerate3.apply(this, arguments);
}
function _generateHotp2() {
  var {
    OTP_CONFIG
  } = this;
  var {
    OTP_LENGTH
  } = OTP_CONFIG;

  // Create HMAC
  var hashKey = _crypto.default.randomBytes(20);
  var hmac = _crypto.default.createHmac('sha1', hashKey);

  // Generate Digest
  var digestSecret = _crypto.default.randomUUID();
  var digest = hmac.update(digestSecret).digest('hex');

  // Pluck Digest Substring
  var offset = parseInt(digest.slice(-1), 16);
  var substring = digest.slice(offset, offset + 8);

  // Build Otp from Digest Substring
  var decimal = parseInt(substring, 16);
  var Otp = _lodash.default.padStart((decimal % Math.pow(10, OTP_LENGTH)).toString(), OTP_LENGTH);
  return Otp;
}
function _shouldValidate2() {
  return _shouldValidate3.apply(this, arguments);
}
function _shouldValidate3() {
  _shouldValidate3 = _asyncToGenerator(function* () {
    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
      OTP_CONFIG
    } = this;
    var {
      OTP_VAL_LIMIT
    } = OTP_CONFIG;
    var {
      ReferenceId
    } = attrs;

    // Validate Validation Count
    var validationCount = yield this.incValidCount(ReferenceId);
    if (validationCount > OTP_VAL_LIMIT) {
      throw new _OtpError.default(attrs, _ERRORS.OTP_VAL_EXCEEDED_ERROR);
    }

    // Get Cached Otp
    var cachedOtp = yield this.getCachedOtp(ReferenceId);
    if (!cachedOtp) {
      throw new _OtpError.default(attrs, _ERRORS.OTP_EXPIRED_ERROR);
    }

    // Return Cached Otp
    return cachedOtp;
  });
  return _shouldValidate3.apply(this, arguments);
}