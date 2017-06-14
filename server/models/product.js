const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messages = require('./../utilities/messages')

const NAME_MIN_LENGTH = 3
const PRICE_MIN_VALUE = 0
const PRICE_MAX_VALUE = Number.MAX_VALUE

const productSchema = new Schema({
  name: { type: String, minlength: [NAME_MIN_LENGTH, messages.validator.minLength], required: true, unique: true },
  description: { type: String },
  price: { type: Number, min: PRICE_MIN_VALUE, max: PRICE_MAX_VALUE, default: 0 },
  image: { type: String },
  slug: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
  isBought: { type: Boolean, default: false },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
})

module.exports = mongoose.model('Product', productSchema)
