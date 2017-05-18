const path = require('path')
const Product = require('./../models/product.model')

function getHomePage (req, res) {
  let name = new RegExp(req.query.name, 'gui')
  Product.find({name: {$regex: name}}).then(products => {
    res.render(path.join(__dirname, '../views/home/index'), { products })
  }).catch(err => res.status(500).send(err))
}

module.exports = {
  getHomePage: getHomePage
}
