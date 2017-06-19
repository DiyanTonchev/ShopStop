const path = require('path')
const fs = require('fs')
const cuid = require('cuid')
const slug = require('slug')
const serverConfig = require('./../config')
const Product = require('./../models/product')
const Category = require('./../models/category')
const messages = require('./../utilities/messages')

const DEFAULT_PRODUCT_IMAGE = 'images/default-product-image.jpg'

function getAddProductPage (req, res) {
  Category
    .find()
    .then((categories) => {
      res.render('product/add', { categories })
    })
    .catch(err => res.status(500).send(err))
}

function getBuyProductPage (req, res) {
  let productId = req.params.id
  Product
    .findById(productId)
    .then((product) => {
      if (product.buyer) {
        res.render('product/buy', { error: messages.auth.productAlreadyBought })
        return
      }

      res.render('product/buy', { product })
    })
    .catch(err => res.status(500).send(err))
}

function getEditProductPage (req, res) {
  let productId = req.params.id
  Product
    .findById(productId)
    .then((product) => {
      let canEdit = (product.creator.equals(req.user._id)) || req.user.roles.includes('Admin')
      if (canEdit) {
        Category
          .find()
          .then((categories) => {
            res.render('product/edit', { product, categories })
          })
      } else {
        res.redirect(302, '/')
      }
    })
    .catch(err => res.status(500).send(err))
}

function getDeleteProductPage (req, res) {
  let productId = req.params.id
  Product
    .findById(productId)
    .then((product) => {
      let canDelete = (product.creator.equals(req.user._id)) || req.user.roles.includes('Admin')
      if (canDelete) {
        Category
          .find()
          .then((categories) => {
            res.render('product/delete', { product, categories })
          })
      } else {
        res.redirect(302, '/')
      }
    })
    .catch(err => res.status(500).send(err))
}

function addProduct (req, res) {
  let data = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    slug: slug(req.body.name.toLocaleLowerCase(), { lowercase: true }),
    cuid: cuid(),
    isBought: req.body.isBought,
    creator: req.user._id,
    buyer: req.body.buyer,
    category: req.body.category
  }

  let newProduct = new Product(data)

  if (req.file) {
    let filename = req.file.path.split(/[\\\/]/g).pop()
    newProduct.image = `images/${filename}`
  } else {
    newProduct.image = DEFAULT_PRODUCT_IMAGE
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
    .catch((err) => {
      let errors = err.errors
      let messages = []
      for (let currentError in errors) {
        messages.push(errors[currentError].message)
      }

      console.error(messages)
      res.status(400).send(messages)
    })
}

function buyProduct (req, res) {
  let productId = req.params.id

  Product
    .findById(productId)
    .then((product) => {
      if (product.buyer) {
        res.render('product/buy', { error: messages.auth.productAlreadyBought })
        return
      }

      product.buyer = req.user._id
      product
        .save()
        .then(() => {
          req.user.boughtProducts.push(productId)
          req.user
            .save()
            .then(() => {
              res.redirect(302, '/')
            })
        })
    })
    .catch(err => res.status(500).send(err))
}

function editProduct (req, res) {
  let productId = req.params.id
  let editedProduct = req.body
  Product
    .findById(productId)
    .then((product) => {
      let canEdit = (product.creator.equals(req.user._id)) || req.user.roles.includes('Admin')
      if (canEdit) {
        product.name = editedProduct.name || product.name
        product.slug = slug(product.name.toLocaleLowerCase(), { lowercase: true })
        product.description = editedProduct.description
        product.price = editedProduct.price || product.price
        if (req.file) {
          let oldImage = product.image
          let filename = req.file.path.split(/[\\\/]/g).pop()
          product.image = `images/${filename}`
          if (oldImage !== DEFAULT_PRODUCT_IMAGE) {
            fs.unlink(path.join(serverConfig.rootPath, 'public', 'content', oldImage), (err) => {
              if (err) {
                console.error(err)
                return
              }
            })
          }
        }

        if (editedProduct.category.toString() !== product.category.toString()) {
          Category
            .findById(product.category)
            .then((currentCategory) => {
              Category
                .findById(editedProduct.category)
                .then((newCategory) => {
                  let indexOfProduct = currentCategory.products.indexOf(product._id)
                  if (indexOfProduct >= 0) {
                    currentCategory.products.splice(indexOfProduct, 1)
                    currentCategory.save()
                  }

                  newCategory.products.push(product._id)
                  newCategory.save()

                  product.category = editedProduct.category
                  product
                    .save()
                    .then((savedProduct) => {
                      res.redirect(302, '/')
                    })
                })
            })
        } else {
          product
            .save()
            .then((savedProduct) => {
              res.redirect(302, '/')
            })
        }
      } else {
        res.redirect(302, '/')
      }
    })
    .catch((err) => {
      let errors = err.errors
      let messages = []
      for (let currentError in errors) {
        messages.push(errors[currentError].message)
      }

      console.error(messages)
      res.status(400).send(messages)
    })
}

function deleteProduct (req, res) {
  let productId = req.params.id

  Product
    .findByIdAndRemove(productId)
    .then((product) => {
      let canDelete = (product.creator.equals(req.user._id)) || req.user.roles.includes('Admin')
      if (canDelete) {
        if (product.image !== DEFAULT_PRODUCT_IMAGE) {
          fs.unlink(path.join(serverConfig.rootPath, 'public', 'content', product.image), (err) => {
            if (err) {
              console.error(err)
              return
            }
          })
        }

        Category.findById(product.category).then((category) => {
          let indexOfProduct = category.products.indexOf(product._id)
          if (indexOfProduct >= 0) {
            category.products.splice(indexOfProduct, 1)
            category.save()
            res.redirect(302, '/')
          }
        })
      } else {
        res.redirect(302, '/')
      }
    })
    .catch(err => res.status(500).send(err))
}

module.exports = {
  getAddProductPage,
  getEditProductPage,
  getBuyProductPage,
  getDeleteProductPage,
  addProduct,
  buyProduct,
  editProduct,
  deleteProduct
}
