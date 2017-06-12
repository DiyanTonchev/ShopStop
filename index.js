// require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const serverConfig = require('./config')
const routes = require('./server/routes/routes')

// Initialize the Express App
const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(serverConfig.rootPath, 'views'))

// Set native promises as mongoose promise
mongoose.Promise = global.Promise

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!')
    throw error
  }

  console.log('MongoDB up and running!')
})

// Apply body Parser and server public assets and routes
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/favicon.ico', express.static(path.join(serverConfig.rootPath, 'public', 'content', 'images', 'favicon.ico')))
app.use(express.static(path.join(serverConfig.rootPath, 'public', 'content')))
app.use(routes)

// start app
app.listen(serverConfig.port, () => {
  console.log(`App is running on port ${serverConfig.port}!`)
})
