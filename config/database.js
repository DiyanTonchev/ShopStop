let products = []
let count = 1

module.exports.products = {}

module.exports.products.getAll = () => {
  return products
}

module.exports.products.addProduct = (product) => {
  product.id = count++
  products.push(product)
}

module.exports.products.findByName = (name) => {
  let product = products.filter((p) => {
    p.name === name
  })

  return product[0] || null
}
