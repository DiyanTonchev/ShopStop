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
  let data = {
    name: req.body.name,
    slug: slug(req.body.name.toLocaleLowerCase, { lowercase: true }),
    cuid: cuid(),
    creator: req.user._id
  }

  Category
    .create(data)
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
