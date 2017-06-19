const cuid = require('cuid')
const slug = require('slug')
const User = require('./../models/user')
const encryption = require('./../utilities/encryption')
const messages = require('./../utilities/messages')

function getRegisterPage (req, res) {
  res.render('user/register')
}

function getLoginPage (req, res) {
  res.render('user/login')
}

function register (req, res) {
  let data = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    age: req.body.age,
    gender: req.body.gender
  }

  if (req.body.password && req.body.password !== req.body.confirmedPassword) {
    data.error = messages.errors.passwordsNotMatch
    res.render('user/register', data)
    return
  }

  if (req.body.password) {
    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, req.body.password)
    data.salt = salt
    data.password = hashedPassword
  }

  data.slug = slug(data.username.toLocaleLowerCase(), { lowercase: true })
  data.cuid = cuid()

  User
    .create(data)
    .then((user) => {
      req.login(user, (error, user) => {
        if (error) {
          console.error(error)
          res.render('user/register', { error: messages.errors.authentication })
          return
        }

        res.redirect(302, '/')
      })
    })
    .catch((error) => {
      data.error = error
      res.render('user/register', data)
    })
}

function login (req, res) {
  let userToLogin = {
    username: req.body.username,
    password: req.body.password
  }

  User
    .findOne({ username: userToLogin.username })
    .then((user) => {
      if (!user || !user.authenticate(userToLogin.password)) {
        res.render('user/login', { error: messages.errors.invalidCredentials })
      } else {
        req.login(user, (error, user) => {
          if (error) {
            console.error(error)
            res.render('user/register', { error: messages.errors.authentication })
            return
          }

          res.redirect(302, '/')
        })
      }
    })
}

function logout (req, res) {
  req.logout()
  res.redirect(302, '/')
}

function getProfile (req, res) {
  let username = req.params.username

  User
    .findOne({ username })
    .populate({
      path: 'boughtProducts',
      select: 'image name description slug price category',
      populate: { path: 'category' }
    })
    .populate('category')
    // .populate('boughtProducts', 'image name description slug price category')
    .then((user) => {
      res.render('user/profile', { user, products: user.boughtProducts })
    })
    .catch(err => res.status(500).send(err))
}

module.exports = {
  getRegisterPage,
  getLoginPage,
  register,
  login,
  logout,
  getProfile
}
