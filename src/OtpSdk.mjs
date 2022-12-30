import _ from 'lodash'
import DEFAULT_CONFIG from './CONFIG.mjs'
import Hotp from './lib/Hotp.mjs'

export default class OtpSdk {
  #Hotp

  constructor (config = {}) {
    const CONFIG = _.merge(DEFAULT_CONFIG, config)
    const { REDIS_CONFIG = {}, OTP_CONFIG = {} } = CONFIG

    this.CONFIG = CONFIG
    this.#Hotp = new Hotp(REDIS_CONFIG, OTP_CONFIG)
    this.initialize = this.#Hotp.initialize
    this.generateHotp = this.#Hotp.generate
    this.validateHotp = this.#Hotp.validate
  }
}
