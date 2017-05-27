require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const serverConfig = require('./config/config')
const routes = require('./routes/routes')

// Initialize the Express App
const app = express()

app.set('view engine', 'ejs')

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
app.use(express.static(path.join(__dirname, 'public')))
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'content', 'images', 'favicon.ico')))
app.use(routes)

// start app
app.listen(serverConfig.port, () => {
  console.log(`App is running on port ${serverConfig.port}!`)
})
