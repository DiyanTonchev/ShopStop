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
const auth = require('./../utilities/auth.js')

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

// USER
router.route('/user/register').get((req, res) => {
  UserController.getRegisterPage(req, res)
})

router.route('/user/login').get((req, res) => {
  UserController.getLoginPage(req, res)
})

router.route('/user/register').post((req, res) => {
  UserController.register(req, res)
})

router.route('/user/login').post((req, res) => {
  UserController.login(req, res)
})

router.route('/user/logout').post((req, res) => {
  UserController.logout(req, res)
})

router.route('/profile/:username').get(auth.isAuthenticated, (req, res) => {
  UserController.getProfile(req, res)
})

// PRODUCT
router.route('/product/add').get(auth.isAuthenticated, (req, res) => {
  ProductController.getAddProductPage(req, res)
})

router.route('/product/buy/:id').get(auth.isAuthenticated, (req, res) => {
  ProductController.getBuyProductPage(req, res)
})

router.route('/product/edit/:id').get(auth.isAuthenticated, (req, res) => {
  ProductController.getEditProductPage(req, res)
})

router.route('/product/delete/:id').get(auth.isAuthenticated, (req, res) => {
  ProductController.getDeleteProductPage(req, res)
})

router.route('/product/add').post(auth.isAuthenticated, upload.single('image'), (req, res) => {
  ProductController.addProduct(req, res)
})

router.route('/product/buy/:id').post(auth.isAuthenticated, (req, res) => {
  ProductController.buyProduct(req, res)
})

router.route('/product/edit/:id').post(auth.isAuthenticated, upload.single('image'), (req, res) => {
  ProductController.editProduct(req, res)
})

router.route('/product/delete/:id').post(auth.isAuthenticated, (req, res) => {
  ProductController.deleteProduct(req, res)
})

// CATEGORY
router.route('/category/add').get(auth.isAuthenticated, auth.isInRole('Admin'), (req, res) => {
  CategoryController.getAddCategoryPage(req, res)
})

router.route('/category/:category/products').get((req, res) => {
  CategoryController.getProducts(req, res)
})

router.route('/category/add').post(auth.isAuthenticated, auth.isInRole('Admin'), (req, res) => {
  CategoryController.addCategory(req, res)
})

// GLOBAL
router.route('*').all((req, res, next) => {
  res.status('404')
  res.render('not-found', { text: messages.errors.notFound })
})

module.exports = router
