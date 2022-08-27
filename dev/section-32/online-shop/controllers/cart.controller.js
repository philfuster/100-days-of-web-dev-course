const cartSession = require("../util/cart.session");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/User");
const orderValidation = require("../util/order.validation");

async function getCart(req, res) {
	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});

	const currencyFormatter = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	});

	const items = sessionCartData.items.map((item) => {
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
	res.render("customer/cart/cart", {
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
		if (!item.id.equals(productId)) return;
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
			id: existingProduct.id,
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
	const { productid, quantity: enteredQuantity } = req.body;
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
		if (!item.id.equals(productid)) return;
		item.quantity = parseInt(enteredQuantity);
		lineTotalPrice = item.price * enteredQuantity;
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
			totalQuantity: totalQuantity,
			lineTotalPrice: currencyFormatter.format(lineTotalPrice),
		});
	});
}

async function checkOut(req, res) {
	const cartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
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
		throw "Invalid User";
	}
	const order = new Order(
		{
			id: user.id,
			fullName: user.fullName,
			street: user.street,
			postalCode: user.postalCode,
			city: user.city,
		},
		new Date(),
		cartData.items,
		cartData.totalPrice,
		cartData.quantity,
		Order.validOrderStatuses.PENDING
	);
	const orderIsValid = await orderValidation.orderIsValid(order);
	if (!orderIsValid) {
		throw "Invalid Order";
	}

	const { insertedId: orderId } = await order.save();

	cartSession.setCartSessionData(
		req,
		{
			...cartSession.defaultCartData,
		},
		function () {
			return res.redirect(`/orders/${orderId}/success`);
		}
	);
}

async function removeItemFromCart(req, res) {
	const { productId } = req.body;
	const cartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	const currencyFormatter = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	});
	let itemRemoved = false;
	cartData.items = cartData.items.filter((item) => {
		if (item.id.equals(productId)) itemRemoved = true;
		return !item.id.equals(productId);
	});
	if (!itemRemoved)
		return res.json({ hasError: true, message: "invalid product" });
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
	return res.json({
		hasError: false,
		cartTotalPrice: currencyFormatter.format(totalPrice),
		totalQuantity,
	});
}

module.exports = {
	getCart,
	addProductToCart,
	updateItemQuantity,
	removeItemFromCart,
	checkOut,
};
