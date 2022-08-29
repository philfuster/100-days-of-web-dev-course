const Order = require("../models/order.model");
const cartSession = require("../util/cart.session");

async function getOrders(req, res) {
	const { id: userId } = req.session.user;
	const currencyFormatter = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	});
	const cartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	const orders = await Order.getOrdersWithSameUser(userId);
	const displayOrders = orders.map((order) => {
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
		return displayOrder;
	});
	res.render("customer/orders", { orders: displayOrders, cartData });
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

module.exports = {
	getOrders,
	getSingleOrder,
	checkOut,
};
