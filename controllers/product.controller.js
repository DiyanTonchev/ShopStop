const path = require('path')
const Product = require('./../models/product.model')

function getAddProductPage (req, res) {
  res.render(path.join(__dirname, '../views/products/add'))
}

function addProduct (req, res) {
  new Product(req.body).save().then((response) => {
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
