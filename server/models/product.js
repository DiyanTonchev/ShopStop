const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, min: 0, max: Number.MAX_VALUE, default: 0 },
  image: { type: String },
  slug: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
  isBought: { type: Boolean, default: false },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
})

module.exports = mongoose.model('Product', productSchema)
