"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _CONFIG = _interopRequireDefault(require("./CONFIG.js"));
var _Hotp2 = _interopRequireDefault(require("./lib/Hotp.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
var _Hotp = /*#__PURE__*/new WeakMap();
class OtpSdk {
  constructor() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classPrivateFieldInitSpec(this, _Hotp, {
      writable: true,
      value: void 0
    });
    var CONFIG = _lodash.default.merge(_CONFIG.default, config);
    var {
      REDIS_CONFIG = {},
      OTP_CONFIG = {}
    } = CONFIG;
    this.CONFIG = CONFIG;
    _classPrivateFieldSet(this, _Hotp, new _Hotp2.default(REDIS_CONFIG, OTP_CONFIG));
    this.initialize = this.initialize.bind(this);
    this.generateHotp = _classPrivateFieldGet(this, _Hotp).generate;
    this.validateHotp = _classPrivateFieldGet(this, _Hotp).validate;
  }
  initialize() {
    var _this = this;
    return _asyncToGenerator(function* () {
      yield _classPrivateFieldGet(_this, _Hotp).initialize();
    })();
  }
}
exports.default = OtpSdk;