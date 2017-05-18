const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, min: 0 },
  // creator: Schema.Types.ObjectId
  imageUrl: { type: String },
  slug: { type: 'String', required: true },
  cuid: { type: 'String', required: true }
  // isBought: { type: Boolean },
  // category: { type: Schema.Types.ObjectId }
})

module.exports = mongoose.model('Product', productSchema)
