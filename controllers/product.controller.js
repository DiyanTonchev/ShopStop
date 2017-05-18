const path = require('path')
const Product = require('./../models/product.model')
const cuid = require('cuid')
const slug = require('slug')

function getAddProductPage (req, res) {
  res.render(path.join(__dirname, '../views/products/add'))
}

function addProduct (req, res) {
  let newProduct = new Product(req.body)
  newProduct.slug = slug(newProduct.name.toLocaleLowerCase(), { lowercase: true })
  newProduct.cuid = cuid()
  newProduct.save().then((saved) => {
    res.redirect(302, '/')
  }).catch(err => res.status(500).send(err))
}

function findByName () {
  //  TODO implement
}

module.exports = {
  getAddProductPage: getAddProductPage,
  addProduct: addProduct,
  findByName: findByName
}
