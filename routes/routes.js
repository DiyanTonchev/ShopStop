const express = require('express')
const router = express.Router()
const ProductController = require('./../controllers/product.controller')
const HomeController = require('./../controllers/home.controller')

router.route('/').get((req, res) => {
  HomeController.getHomePage(req, res)
})

router.route('/product/add').get((req, res) => {
  ProductController.getAddProductPage(req, res)
})

router.route('/product/add').post((req, res) => {
  ProductController.addProduct(req, res)
})

module.exports = router
