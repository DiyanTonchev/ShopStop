const crypto = require('crypto')

module.exports = {
  generateSalt: () => {
    return
  },
  generateHashedPassword: (salt, password) => {
    return crypto.createHmac('sha256', salt).update(password).digest('hex')
  }
}
