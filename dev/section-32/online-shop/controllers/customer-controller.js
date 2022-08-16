const Product = require("../models/product");
const cartSession = require("../util/cart-session");

async function getProducts(req, res) {
	const products = await Product.fetchAll();
	const sessionCartData = cartSession.getCartSessionData(req, {
		items: [],
		totalPrice: 0,
		quantity: 0,
	});
	res.render("customer/products", { products, cartData: sessionCartData });
}

async function getSingleProduct(req, res) {
	const { id } = req.params;
	const product = new Product(null, null, null, null, null, id);

	await product.fetch();

	if (!product.name) {
		return res.redirect("404");
	}

	const sessionCartData = cartSession.getCartSessionData(req, {
		items: [],
		totalPrice: 0,
		quantity: 0,
	});

	product.formattedPrice = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	}).format(product.price);

	res.render("customer/single-product", {
		product,
		csrfToken: req.csrfToken(),
		cartData: sessionCartData,
	});
}

async function getCart(req, res) {
	const sessionCartData = cartSession.getCartSessionData(req, {
		items: [],
		totalPrice: 0,
		quantity: 0,
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
	res.render("customer/cart", {
		cartData: sessionCartData,
		csrfToken: req.csrfToken(),
	});
}

async function addProductToCart(req, res) {
	const { productId } = req.body;
	const cartData = cartSession.getCartSessionData(req, {
		items: [],
		cartTotalPrice: 0,
		quantity: 0,
	});

	let itemUpdated = false;
	cartData.items.forEach((item) => {
		if (item.id !== productId) return;
		item.quantity += 1;
		cartData.cartTotalPrice += item.price;
		itemUpdated = true;
	});
	if (!itemUpdated) {
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
			id: existingProduct.id.toString(),
			name: existingProduct.name,
			price: existingProduct.price,
			totalPrice: existingProduct.price,
			quantity: 1,
		});
		cartData.cartTotalPrice += existingProduct.price;
	}
	cartData.quantity = calculateCartTotalQuantity(cartData.items);
	cartSession.setCartSessionData(req, cartData, function () {
		res.json({ hasError: false, cartTotalQuantity: cartData.quantity });
	});
}

function calculateCartTotalQuantity(items) {
	return items.reduce((accumulator, item) => {
		return (accumulator += item.quantity);
	}, 0);
}

async function updateItemQuantity(req, res) {
	const { productid, quantity } = req.body;
	const currencyFormatter = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	});
	const cartData = cartSession.getCartSessionData(req, {
		items: [],
		cartTotalPrice: 0,
		quantity: 0,
	});
	let itemUpdated = false;
	let lineTotalPrice = 0;
	cartData.items.forEach((item) => {
		if (item.id !== productid) return;
		item.quantity = parseInt(quantity);
		lineTotalPrice = item.price * quantity;
		itemUpdated = true;
	});
	if (!itemUpdated) {
		return res.json({ hasError: true, message: 'invalid product.'});
	}
	const { totalPrice, totalQuantity } = cartData.items.reduce((accumulator, item) => {
		accumulator.totalPrice += item.price * item.quantity;
		accumulator.totalQuantity += item.quantity;
		return accumulator;
	}, {
		totalPrice: 0,
		totalQuantity: 0
	});
	cartData.cartTotalPrice = totalPrice;
	cartData.quantity = totalQuantity;
	cartSession.setCartSessionData(req, cartData, function () {
		res.json({ hasError: false, cartTotalPrice: currencyFormatter.format(cartData.cartTotalPrice), totalQuantity: parseInt(totalQuantity), lineTotalPrice: currencyFormatter.format(lineTotalPrice) });
	});
}

async function checkOut(req, res) {
	const cartData = cartSession.getCartSessionData(req, {
		items: [],
		cartTotalPrice: 0,
		quantity: 0,
	});

}

module.exports = {
	getProducts,
	getSingleProduct,
	getCart,
	addProductToCart,
	updateItemQuantity
};
