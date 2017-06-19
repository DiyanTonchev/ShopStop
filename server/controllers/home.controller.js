const Product = require('./../models/product')

function getHomePage (req, res) {
  let name = new RegExp(req.query.name, 'gui')
  Product
    .find({ name: { $regex: name }, isBought: false })
    .populate('category')
    .then((products) => {
      res.render('home/index', { products })
    })
    .catch(err => res.status(500).send(err))
}

module.exports = {
  getHomePage: getHomePage
}
