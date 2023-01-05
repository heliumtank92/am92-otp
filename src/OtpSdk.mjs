import _ from 'lodash'
import DEFAULT_CONFIG, { SERVICE } from './CONFIG.mjs'
import Hotp from './lib/Hotp.mjs'

export default class OtpSdk {
  #Hotp

  constructor (config = {}) {
    const CONFIG = _.merge(DEFAULT_CONFIG, config)
    const { REDIS_CONFIG = {}, OTP_CONFIG = {} } = CONFIG

    this.CONFIG = CONFIG
    this.#Hotp = new Hotp(REDIS_CONFIG, OTP_CONFIG)

    this.initialize = this.initialize.bind(this)
    this.generateHotp = this.#Hotp.generate
    this.validateHotp = this.#Hotp.validate
  }

  async initialize () {
    console.trace(`[${SERVICE} OtpSdk] Initialising...`)
    await this.#Hotp.initialize()
    console.info(`[${SERVICE} OtpSdk] Initialised`)
  }
}
