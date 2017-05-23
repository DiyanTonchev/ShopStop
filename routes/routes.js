const express = require('express')
const router = express.Router()
const path = require('path')
const ProductController = require('./../controllers/product.controller')
const HomeController = require('./../controllers/home.controller')
const multer = require('multer')

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

router.route('/').get((req, res) => {
  HomeController.getHomePage(req, res)
})

router.route('/product/add').get((req, res) => {
  ProductController.getAddProductPage(req, res)
})

router.route('/product/add').post(upload.single('image'), (req, res) => {
  ProductController.addProduct(req, res)
})

module.exports = router
