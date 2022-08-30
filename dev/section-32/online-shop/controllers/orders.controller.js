const Order = require("../models/order.model");
const User = require("../models/user.model");
const cartSession = require("../util/cart.session");

async function getOrders(req, res) {
	try {
		const orders = await Order.findAllForUser(res.locals.uid);
		res.render("customer/orders/all-orders", { orders: orders });
	} catch (error) {
		next(error);
	}
}

async function getSingleOrder(req, res) {
	const { id: orderId } = req.params;
	const order = new Order(null, null, null, null, null, null, orderId);
	await order.fetch();
	if (!order.user.id.equals(req.session.user.id)) {
		return res.redirect("/401");
	}
	const currencyFormatter = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	});
	const cartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	const displayOrder = {
		formattedTotalPrice: currencyFormatter.format(order.totalPrice),
		formattedQuantity: order.quantity,
		status: order.status,
		formattedDate: new Date(order.date).toLocaleString("en-US", {
			weekday: "short",
			year: "numeric",
			month: "long",
			day: "numeric",
		}),
		items: order.items.map((item) => {
			return {
				name: item.name,
				formattedPrice: currencyFormatter.format(item.price),
				formattedTotalPrice: currencyFormatter.format(item.totalPrice),
				quantity: item.quantity,
			};
		}),
	};
	res.render("customer/order-success", {
		order: displayOrder,
		cartData,
	});
}

async function addOrder(req, res, next) {
	const cart = res.locals.cart;

	let userDocument;
	try {
		userDocument = await User.findById(res.locals.uid);
	} catch (error) {
		return next(error);
	}

	const order = new Order(cart, userDocument);
	try {
		await order.save();
	} catch (error) {
		next(error);
	}

	req.session.cart = null;

	return res.redirect("/orders");
}

module.exports = {
	getOrders,
	getSingleOrder,
	addOrder: addOrder,
};
