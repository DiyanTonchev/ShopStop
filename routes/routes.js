const express = require('express')
const path = require('path')
const multer = require('multer')
const HomeController = require('./../controllers/home.controller')
const ProductController = require('./../controllers/product.controller')
const CategoryController = require('./../controllers/category.controller')
const router = express.Router()

let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../public/content/images'))
  },
  filename: (req, file, callback) => {
    callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

let upload = multer({
  storage: storage
  // fileFilter: (req, file, callback) => {
  //   let extension = path.extname(file.originalname)
  //   if (extension !== '.png' && extension !== '.jpg' && extension !== '.gif' && extension !== '.jpeg') {
  //     // return callback(null, false, new Error('Invalid mime type!'))
  //   }

  //   callback(null, true)
  // }
})

// Home route
router.route('/').get((req, res) => {
  HomeController.getHomePage(req, res)
})

// Product routes
router.route('/product/add').get((req, res) => {
  ProductController.getAddProductPage(req, res)
})

router.route('/product/edit/:id').get((req, res) => {
  ProductController.getEditProductPage(req, res)
})

router.route('/product/add').post(upload.single('image'), (req, res) => {
  ProductController.addProduct(req, res)
})

router.route('/product/edit/:id').post(upload.single('image'), (req, res) => {
  ProductController.editProduct(req, res)
})

router.route('/product/delete/:id').get((req, res) => {
  ProductController.getDeleteProductPage(req, res)
})

router.route('/product/delete/:id').post((req, res) => {
  ProductController.deleteProduct(req, res)
})

// Category routes
router.route('/category/add').get((req, res) => {
  CategoryController.getAddCategoryPage(req, res)
})

router.route('/category/add').post((req, res) => {
  CategoryController.addCategory(req, res)
})

router.route('/category/:category/products').get((req, res) => {
  CategoryController.getProducts(req, res)
})

module.exports = router
