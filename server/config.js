const path = require('path')

const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/shop-stop',
  port: process.env.PORT || 8080,
  rootPath: path.join(__dirname, '../')
}

module.exports = config
