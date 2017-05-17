const path = require('path')
const database = require('./../config/database')

function getHomePage (req, res) {
  let products = database.products.getAll()
  let productNameQuery = req.query.pname
  if (productNameQuery) {
    products = products.filter(p => { return p.name.toLocaleLowerCase().includes(productNameQuery.toLocaleLowerCase()) })
  }

  res.render(path.join(__dirname, '../views/home/index'), { products: products })
}

module.exports = {
  getHomePage: getHomePage
}
