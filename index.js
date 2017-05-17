const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const routes = require('./routes/routes')

const port = 3000

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(routes)

app.listen(port, function () {
  console.log(`App listening on port ${port}!`)
})
