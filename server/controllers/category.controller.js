const Category = require('./../models/category.model')
const cuid = require('cuid')
const slug = require('slug')

function getAddCategoryPage (req, res) {
  res.render('category/add')
}

function getProducts (req, res) {
  let categoryName = req.params.category

  Category
    .findOne({ slug: categoryName })
    .populate('products')
    .then((category) => {
      res.render('category/products', { category })
    })
}

function addCategory (req, res) {
  if (!req.body.name) {
    res.status(403).end()
  }

  let newCategory = new Category(req.body)
  newCategory.slug = slug(newCategory.name.toLocaleLowerCase(), { lowercase: true })
  newCategory.cuid = cuid()

  newCategory
    .save()
    .then((saved) => {
      res.redirect(302, '/')
    }).catch(err => res.status(500).send(err))
}

module.exports = {
  getAddCategoryPage,
  getProducts,
  addCategory
}
