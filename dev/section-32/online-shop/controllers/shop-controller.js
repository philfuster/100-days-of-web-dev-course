const Product = require('../models/product');

async function getProducts(req, res) {
	const products = await Product.fetchAll();
	res.render("products", { products});
}

async function getSingleProduct(req, res) {
	const { id } = req.params;
	const product = new Product(null, null, null, null, null, id);

	await product.fetch();

	if(!product.name) {
		return res.status(404).render('404');
	}

	res.render("single-product", { product })
}

module.exports = {
	getProducts,
	getSingleProduct
}
