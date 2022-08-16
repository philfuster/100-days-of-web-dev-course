const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const orderValidation = require("../util/order-validation");
const cartSession = require("../util/cart-session");

async function getProducts(req, res) {
	const products = await Product.fetchAll();
	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
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

	const sessionCartData = cartSession.tgetCartSessionData(req, {
		...cartSession.defaultCartData,
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
		...cartSession.defaultCartData,
	});

	const currencyFormatter = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	});

	const items = sessionCartData.items.map((item) => {
		const lineTotal = item.price * item.quantity;
		const displayItem = {
			id: item.id,
			name: item.name,
			quantity: item.quantity,
			formattedPrice: currencyFormatter.format(item.price),
			formattedTotalPrice: currencyFormatter.format(item.totalPrice),
		};
		return displayItem;
	});
	const cartData = {
		items,
		totalPrice: currencyFormatter.format(sessionCartData.totalPrice),
		quantity: sessionCartData.quantity,
	};
	res.render("customer/cart", {
		cartData,
		csrfToken: req.csrfToken(),
	});
}

async function addProductToCart(req, res) {
	const { productId } = req.body;
	const cartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});

	let itemUpdated = false;
	cartData.items.forEach((item) => {
		if (item.id !== productId) return;
		item.quantity += 1;
		item.totalPrice += item.price;
		cartData.totalPrice += item.price;
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
		cartData.totalPrice += existingProduct.price;
	}
	cartData.quantity = cartData.items.reduce((accumulator, item) => {
		return (accumulator += item.quantity);
	}, 0);
	cartSession.setCartSessionData(req, cartData, function () {
		res.json({ hasError: false, cartTotalQuantity: cartData.quantity });
	});
}

async function updateItemQuantity(req, res) {
	const { productid, quantity } = req.body;
	const currencyFormatter = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	});
	const cartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	let itemUpdated = false;
	let lineTotalPrice = 0;
	cartData.items.forEach((item) => {
		if (item.id !== productid) return;
		item.quantity = parseInt(quantity);
		lineTotalPrice = item.price * quantity;
		item.totalPrice = lineTotalPrice;
		itemUpdated = true;
	});
	if (!itemUpdated) {
		return res.json({ hasError: true, message: "invalid product." });
	}
	const { totalPrice, totalQuantity } = cartData.items.reduce(
		(accumulator, item) => {
			accumulator.totalPrice += item.totalPrice;
			accumulator.totalQuantity += item.quantity;
			return accumulator;
		},
		{
			totalPrice: 0,
			totalQuantity: 0,
		}
	);
	cartData.totalPrice = totalPrice;
	cartData.quantity = totalQuantity;
	cartSession.setCartSessionData(req, cartData, function () {
		res.json({
			hasError: false,
			cartTotalPrice: currencyFormatter.format(cartData.totalPrice),
			totalQuantity: parseInt(totalQuantity),
			lineTotalPrice: currencyFormatter.format(lineTotalPrice),
		});
	});
}

async function checkOut(req, res) {
	const cartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	console.log(cartData);
	const user = new User(
		null,
		null,
		null,
		null,
		null,
		null,
		req.session.user.id
	);
	await user.fetch();
	if (user.fullName == null || user.email == null) {
		return res.redirect("/500");
	}
	const order = new Order(
		{
			fullName: user.fullName,
			street: user.street,
			postalCode: user.postalCode,
			city: user.city,
		},
		new Date(),
		cartData.items,
		cartData.totalPrice,
		cartData.quantity,
		"PENDING"
	);
	console.log(order);
	const orderIsValid = await orderValidation.orderIsValid(order);
	if (!orderIsValid) {
		return res.redirect("/500");
	}

	await order.save();

	cartSession.setCartSessionData(
		req,
		{
			...cartSession.defaultCartData,
		},
		function () {
			return res.redirect("/cart");
		}
	);
}

module.exports = {
	getProducts,
	getSingleProduct,
	getCart,
	addProductToCart,
	updateItemQuantity,
	checkOut,
};
