const express = require('express')
const path = require('path')
const multer = require('multer')
const router = express.Router()
const serverConfig = require('./../config')
const HomeController = require('./../controllers/home.controller')
const ProductController = require('./../controllers/product.controller')
const CategoryController = require('./../controllers/category.controller')
const UserController = require('./../controllers/user.controller')
const messages = require('./../utilities/messages')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(serverConfig.rootPath, 'public', 'content', 'images'))
  },
  filename: (req, file, callback) => {
    callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage: storage
  // fileFilter: (req, file, callback) => {
  //   let extension = path.extname(file.originalname)
  //   if (extension !== '.png' && extension !== '.jpg' && extension !== '.gif' && extension !== '.jpeg') {
  //     // return callback(null, false, new Error('Invalid mime type!'))
  //   }

  //   callback(null, true)
  // }
})

// HOME
router.route('/').get((req, res) => {
  HomeController.getHomePage(req, res)
})

// PRODUCT
// GET
router.route('/product/add').get((req, res) => {
  ProductController.getAddProductPage(req, res)
})

router.route('/product/buy/:id').get((req, res) => {
  ProductController.getBuyProductPage(req, res)
})

router.route('/product/edit/:id').get((req, res) => {
  ProductController.getEditProductPage(req, res)
})

router.route('/product/delete/:id').get((req, res) => {
  ProductController.getDeleteProductPage(req, res)
})

// POST
router.route('/product/add').post(upload.single('image'), (req, res) => {
  ProductController.addProduct(req, res)
})

router.route('/product/buy/:id').post((req, res) => {
  ProductController.buyProduct(req, res)
})

router.route('/product/edit/:id').post(upload.single('image'), (req, res) => {
  ProductController.editProduct(req, res)
})

router.route('/product/delete/:id').post((req, res) => {
  ProductController.deleteProduct(req, res)
})

// CATEGORY
// GET
router.route('/category/add').get((req, res) => {
  CategoryController.getAddCategoryPage(req, res)
})

router.route('/category/:category/products').get((req, res) => {
  CategoryController.getProducts(req, res)
})

// POST
router.route('/category/add').post((req, res) => {
  CategoryController.addCategory(req, res)
})

// GLOBAL
router.route('*').all((req, res, next) => {
  res.status('404')
  res.render('not-found', { text: messages.notFound })
})

module.exports = router
