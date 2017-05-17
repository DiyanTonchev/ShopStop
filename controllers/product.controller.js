const path = require('path')
const database = require('./../config/database')

function getAddProductPage (req, res) {
  res.render(path.join(__dirname, '../views/products/add'))
}

function addProduct (req, res) {
  let product = req.body
  database.products.addProduct(product)
  res.redirect(302, '/')
}

function findByName () {

}

module.exports = {
  getAddProductPage: getAddProductPage,
  addProduct: addProduct,
  findByName: findByName
}
