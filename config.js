const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/shop-stop',
  port: process.env.PORT || 8080,
  rootPath: __dirname
}

module.exports = config
