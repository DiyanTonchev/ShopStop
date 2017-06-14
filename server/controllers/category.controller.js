const cuid = require('cuid')
const slug = require('slug')
const Category = require('./../models/category')

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
    .catch(err => res.status(500).send(err))
}

function addCategory (req, res) {
  if (!req.body.name) {
    res.status(403).end()
  }

  // TODO: Correct this
  let newCategory = new Category(req.body)
  newCategory.slug = slug(newCategory.name.toLocaleLowerCase(), { lowercase: true })
  newCategory.cuid = cuid()

  newCategory
    .save()
    .then((saved) => {
      res.redirect(302, '/')
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

module.exports = {
  getAddCategoryPage,
  getProducts,
  addCategory
}
