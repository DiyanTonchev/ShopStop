const path = require('path')
const Product = require('./../models/product.model')
const cuid = require('cuid')
const slug = require('slug')

function getAddProductPage (req, res) {
  res.render(path.join(__dirname, '../views/products/add'))
}

function addProduct (req, res) {
  if (!req.body.name) {
    res.status(403).end()
  }

  let newProduct = new Product(req.body)
  newProduct.slug = slug(newProduct.name.toLocaleLowerCase(), { lowercase: true })
  newProduct.cuid = cuid()

  if (req.file) {
    let filename = req.file.path.split(/[\\\/]/g).pop()
    newProduct.image = `content/images/${filename}`
  } else {
    newProduct.image = 'content/images/default-product.jpg'
  }

  newProduct.save().then((saved) => {
    res.redirect(302, '/')
  }).catch(err => res.status(500).send(err))
}

function findByName () {
  //  TODO implement
}

module.exports = {
  getAddProductPage,
  addProduct,
  findByName
}
