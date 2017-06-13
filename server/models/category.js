const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
})

module.exports = mongoose.model('Category', categorySchema)
