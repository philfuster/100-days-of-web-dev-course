const Product = require("../models/product");
const router = require("../routes/shop");

async function getProducts(req, res) {
	const products = await Product.fetchAll();
	res.render("products", { products });
}

async function getSingleProduct(req, res) {
	const { id } = req.params;
	const product = new Product(null, null, null, null, null, id);

	await product.fetch();

	if (!product.name) {
		return res.status(404).render("404");
	}

	product.formattedPrice = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	}).format(product.price);

	res.render("single-product", { product });
}

async function getCart(req, res) {
	const cart = [];
	res.render("cart", { cart });
}

module.exports = {
	getProducts,
	getSingleProduct,
	getCart,
};
