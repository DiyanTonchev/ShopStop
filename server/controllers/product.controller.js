const cuid = require('cuid')
const slug = require('slug')
const fs = require('fs')
const path = require('path')
const serverConfig = require('./../config')
const Product = require('./../models/product.model')
const Category = require('./../models/category.model')

function getAddProductPage (req, res) {
  Category
    .find()
    .then((categories) => {
      res.render('product/add', { categories })
    })
}

function getBuyProductPage (req, res) {
  let productId = req.params.id
  Product
    .findById(productId)
    .then((product) => {
      res.render('product/buy', { product })
    })
}

function getEditProductPage (req, res) {
  let productId = req.params.id
  Product
    .findById(productId)
    .then((product) => {
      Category
        .find()
        .then((categories) => {
          res.render('product/edit', { product, categories })
        })
    })
}

function getDeleteProductPage (req, res) {
  let productId = req.params.id
  Product
    .findById(productId)
    .then((product) => {
      Category
        .find()
        .then((categories) => {
          res.render('product/delete', { product, categories })
        })
    })
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
    newProduct.image = `images/${filename}`
  } else {
    newProduct.image = 'images/default-product.jpg'
  }

  newProduct
    .save()
    .then((savedProduct) => {
      Category
        .findById(savedProduct.category)
        .then((category) => {
          category.products.push(savedProduct._id)
          category.save()
          res.redirect(302, '/')
        })
    })
    .catch(err => res.status(500).send(err))
}

function buyProduct (req, res) {
  // TODO
  console.log('IN PROGRESS')
  res.redirect(302, '/')
}

function editProduct (req, res) {
  let productId = req.params.id
  let editedProduct = req.body

  Product
    .findById(productId)
    .then((product) => {
      product.name = editedProduct.name || product.name
      product.slug = slug(product.name.toLocaleLowerCase(), { lowercase: true })
      product.description = editedProduct.description
      product.price = editedProduct.price || product.price
      if (req.file) {
        let oldImage = product.image
        let filename = req.file.path.split(/[\\\/]/g).pop()
        product.image = `images/${filename}`
        fs.unlink(path.join(serverConfig.rootPath, 'public', 'content', oldImage), (err) => {
          if (err) {
            console.error(err)
            return
          }
        })
      }

      if (editedProduct.category.toString() !== product.category.toString()) {
        Category.findById(product.category).then((currentCategory) => {
          Category.findById(editedProduct.category).then((newCategory) => {
            let indexOfProduct = currentCategory.products.indexOf(product._id)
            if (indexOfProduct >= 0) {
              currentCategory.products.splice(indexOfProduct, 1)
              currentCategory.save()
            }

            newCategory.products.push(product._id)
            newCategory.save()

            product.category = editedProduct.category
            product.save().then((savedProduct) => {
              res.redirect(302, '/')
            })
          })
        })
      } else {
        product.save().then((savedProduct) => {
          res.redirect(302, '/')
        })
      }
    })
}

function deleteProduct (req, res) {
  let productId = req.params.id

  Product
    .findByIdAndRemove(productId)
    .then((product) => {
      fs.unlink(path.join(serverConfig.rootPath, 'public', 'content', product.image), (err) => {
        if (err) {
          console.error(err)
          return
        }
      })

      Category.findById(product.category).then((category) => {
        let indexOfProduct = category.products.indexOf(product._id)
        if (indexOfProduct >= 0) {
          category.products.splice(indexOfProduct, 1)
          category.save()
          res.redirect(302, '/')
        }
      })
    })
}

function findByName () {
  //  TODO implement
}

module.exports = {
  getAddProductPage,
  getEditProductPage,
  getBuyProductPage,
  getDeleteProductPage,
  addProduct,
  buyProduct,
  editProduct,
  deleteProduct,
  findByName
}
