const mongoose = require('mongoose')
const Schema = mongoose.Schema
const cuid = require('cuid')
const slug = require('slug')
const encryption = require('./../utilities/encryption')
const messages = require('./../utilities/messages')
const admin = require('./../utilities/default-admin-credentials')
const roles = require('./../utilities/roles')

const userSchema = new Schema({
  username: { type: String, required: messages.user.propertyIsRequired, unique: true },
  password: { type: String, required: messages.user.propertyIsRequired },
  salt: { type: String, required: true },
  firstName: { type: String, required: messages.user.propertyIsRequired },
  lastName: { type: String, required: messages.user.propertyIsRequired },
  age: { type: Number, min: [0, messages.user.ageInterval], max: [120, messages.user.ageInterval] },
  gender: { type: String, enum: { values: ['Male', 'Female'], message: messages.user.gender } },
  slug: { type: String, required: true },
  cuid: { type: String, required: true },
  roles: [{ type: String }],
  boughtProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  createdProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  createdCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
})

userSchema.methods.authenticate = function (password) {
  let hashedPassword = encryption.generateHashedPassword(this.salt, password)
  return hashedPassword === this.password
}

let User = mongoose.model('User', userSchema)
module.exports = User
module.exports.seedAdminUser = () => {
  User
    .find()
    .then((users) => {
      if (users.length > 0) {
        return
      }

      let salt = encryption.generateSalt()
      let hashedPassword = encryption.generateHashedPassword(salt, admin.password)
      User.create({
        username: admin.username,
        password: hashedPassword,
        salt: salt,
        firstName: admin.firstName,
        lastName: admin.lastName,
        slug: slug(admin.username.toLocaleLowerCase(), { lowercase: true }),
        cuid: cuid(),
        roles: [roles.admin]
      })
    })
}

