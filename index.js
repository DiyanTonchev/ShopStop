// require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const serverConfig = require('./server/config')
const routes = require('./server/routes/routes')

// Initialize the Express App
const app = express()

// Set native promises as mongoose promise
mongoose.Promise = global.Promise

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!')
    throw error
  }

  require('./server/models/user').seedAdminUser()
  console.log('MongoDB up and running!')
})

// Apply body Parser and server public assets and routes
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({ secret: '!t@1n@b@7k0#%-hv6n-2e2Fvb-A3jShe', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use('/favicon.ico', express.static(path.join(serverConfig.rootPath, 'public', 'content', 'images', 'favicon.ico')))
app.use(express.static(path.join(serverConfig.rootPath, 'public', 'content')))
app.use(routes)

// Set View Engine
app.set('view engine', 'pug')
app.set('views', path.join(serverConfig.rootPath, 'views'))

// start app
app.listen(serverConfig.port, () => {
  console.log(`App is running on port ${serverConfig.port}!`)
})
