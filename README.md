# @am92/otp

[![npm version](https://img.shields.io/npm/v/@am92/otp?style=for-the-badge)](https://www.npmjs.com/package/@am92/otp)&nbsp;
[![ECMAScript Module](https://img.shields.io/badge/ECMAScript-Module%20Only-red?style=for-the-badge)](https://nodejs.org/api/esm.html)&nbsp;
[![License: MIT](https://img.shields.io/npm/l/@am92/otp?color=yellow&style=for-the-badge)](https://opensource.org/licenses/MIT)&nbsp;
[![Vulnerabilities: Snyk](https://img.shields.io/snyk/vulnerabilities/npm/@am92/otp?style=for-the-badge)](https://security.snyk.io/package/npm/@am92%2Fotp)&nbsp;
[![Downloads](https://img.shields.io/npm/dy/@am92/otp?style=for-the-badge)](https://npm-stat.com/charts.html?package=%40m92%2Fotp)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@am92/otp?style=for-the-badge)](https://bundlephobia.com/package/@am92/otp)

<br />

## Table of Content
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Creating an OtpSdk Instance](#creating-an-otpsdk-instance)
- [Contributors](#contributors)
- [Resources](#resources)
- [License](#license)

<br />

## Installation
```bash
$ npm install --save @am92/otp
```
<br />

## Environment Variables
The following environment variables need to be set to work with this package:
```sh
##### Redis Config
export OTP_LENGTH='6'
export OTP_EXPIRY_IN_SECS='300'
export OTP_GEN_HALT_IN_SECS='30'
export OTP_GEN_LIMIT='5'
export OTP_GEN_LIMIT_EXPIRY_IN_SEC='1800'
export OTP_REGEN_LIMIT='3'
export OTP_VAL_LIMIT='3'
#
export OTP_DEDICATED_REDIS='false'
export OTP_REDIS_AUTH_ENABLED='false'
export OTP_REDIS_HOST=''
export OTP_REDIS_PORT='6379'
export OTP_REDIS_KEY_PREFIX=''
export OTP_REDIS_AUTH=''
```

*Note:*
* *If 'OTP_DEDICATED_REDIS' is set to 'true', 'OTP_REDIS_HOST' and 'OTP_REDIS_PORT' are required*
* *If 'OTP_DEDICATED_REDIS' and 'REDIS_AUTH_ENABLED' are set to 'true', 'OTP_REDIS_AUTH' is also required*
* *Variables where values have been defined can be omitted from being defined as the mentioned values are internally defaulted.*

<br />

## Creating an OtpSdk Instance
```javascript
import OtpSdk from '@am92/otp'

const otpSdk = new OtpSdk()
export default otpSdk
```

If you wish to pass your custom 'config' to OtpSdk Class, then you can build it as follows:

```javascript
import OtpSdk from '@am92/otp'

const config = {
  OTP_CONFIG: {
    OTP_LENGTH: 6,
    OTP_EXPIRY_IN_SECS: 300,
    OTP_GEN_HALT_IN_SECS: 30,
    OTP_GEN_LIMIT: 5,
    OTP_GEN_LIMIT_EXPIRY_IN_SEC: 1800,
    OTP_REGEN_LIMIT: 3,
    OTP_VAL_LIMIT: 3,
  },
  REDIS_CONFIG: {
    CONNECTION_CONFIG: {
      socket: {
        host: 'localhost',
        port: 6379,
        tls: true
      },
      password: 'password'
    },
    KEY_PREFIX: 'test'
  }
}

const otpSdk = new OtpSdk(config)
export default otpSdk
```

<br />

## Contributors
<table>
  <tbody>
    <tr>
      <td align="center">
        <a href='https://github.com/ankitgandhi452'>
          <img src="https://avatars.githubusercontent.com/u/8692027?s=400&v=4" width="100px;" alt="Ankit Gandhi"/>
          <br />
          <sub><b>Ankit Gandhi</b></sub>
        </a>
      </td>
      <td align="center">
        <a href='https://github.com/agarwalmehul'>
          <img src="https://avatars.githubusercontent.com/u/8692023?s=400&v=4" width="100px;" alt="Mehul Agarwal"/>
          <br />
          <sub><b>Mehul Agarwal</b></sub>
        </a>
      </td>
    </tr>
  </tbody>
</table>

<br />

## Resources
* [RedisSdk](https://www.npmjs.com/package/@am92/redis)

<br />

## License
* [MIT](https://opensource.org/licenses/MIT)


<br />
<br />
