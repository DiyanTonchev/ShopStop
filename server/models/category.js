const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messages = require('./../utilities/messages')

const NAME_MIN_LENGTH = 3

const categorySchema = new Schema({
  name: {
    type: String,
    minlength: [NAME_MIN_LENGTH, messages.validator.minLength],
    required: true,
    unique: true
  },
  slug: {
    type: 'String',
    required: true
  },
  cuid: {
    type: 'String',
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }]
})

module.exports = mongoose.model('Category', categorySchema)
