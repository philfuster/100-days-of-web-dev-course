const Product = require("../models/product");
const cartSession = require("../util/cart-session");

async function getProducts(req, res) {
	const products = await Product.fetchAll();
	res.render("customer/products", { products });
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

	res.render("customer/single-product", {
		product,
		csrfToken: req.csrfToken(),
	});
}

async function getCart(req, res) {
	const sessionCartData = cartSession.getCartSessionData(req, {
		items: [],
		totalPrice: 0,
	});
	const currencyFormatter = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	});
	let totalPrice = 0;
	sessionCartData.items.forEach((item) => {
		item.formattedPrice = currencyFormatter.format(item.price);
		const lineTotal = item.price * item.quantity;
		totalPrice += lineTotal;
		item.formattedTotalPrice = currencyFormatter.format(lineTotal);
	});
	sessionCartData.cartTotalPrice = currencyFormatter.format(totalPrice);
	res.render("customer/cart", { cartData: sessionCartData });
}

async function addProductToCart(req, res) {
	const { productId } = req.body;
	const cartData = cartSession.getCartSessionData(req, {
		items: [],
		cartTotalPrice: 0,
	});
	// may need to turn productId into a mongo ObjectId
	const itemIndex = cartData.items.find((item) => item._id === productId);
	if (itemIndex == null) {
		const existingProduct = new Product(
			null,
			null,
			null,
			null,
			null,
			productId
		);
		await existingProduct.fetch();
		if (existingProduct.name == null) {
			return res.json({ hasError: true, message: "Product not found." });
		}
		cartData.items.push({
			id: existingProduct.id,
			name: existingProduct.name,
			price: existingProduct.price,
			quantity: 1,
		});
		cartData.cartTotalPrice += existingProduct.price;
	} else {
		cartData.items[itemIndex].quantity += 1;
		cartData.totalPrice += cartData.items[itemIndex].price;
	}
	cartSession.setCartSessionData(req, cartData, function () {
		res.json({ hasError: false });
	});
}

module.exports = {
	getProducts,
	getSingleProduct,
	getCart,
	addProductToCart,
};
