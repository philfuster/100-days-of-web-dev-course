const Product = require('../models/product');

async function getProducts(req, res) {
	const products = await Product.fetchAll();
	res.render("products", { products});
}

module.exports = {
	getProducts
}
