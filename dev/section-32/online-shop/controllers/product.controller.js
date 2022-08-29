const Product = require("../models/product.model");
const cartSession = require("../util/cart.session");

async function getProducts(req, res) {
	const products = await Product.fetchAll();
	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	res.render("customer/products/products", {
		products,
		cartData: sessionCartData,
	});
}

async function getSingleProduct(req, res) {
	const { id } = req.params;

	const product = await Product.findById();

	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});

	product.formattedPrice = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	}).format(product.price);

	res.render("customer/products/single-product", {
		product,
		csrfToken: req.csrfToken(),
		cartData: sessionCartData,
	});
}

module.exports = {
	getProducts,
	getSingleProduct,
};
