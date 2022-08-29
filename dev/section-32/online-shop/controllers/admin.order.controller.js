const Order = require("../models/order.model");

async function getOrders(req, res) {
	const result = await Order.fetchAll();
	const currencyFormatter = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	});
	const orders = result.map((order) => {
		const displayOrder = {
			id: order._id,
			user: order.user,
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
	res.render("admin/orders/orders", {
		orders,
		csrfToken: req.csrfToken(),
	});
}

async function updateOrderStatus(req, res) {
	const { id: orderId } = req.params;
	const { orderStatus } = req.body;
	const order = new Order(null, null, null, null, null, null, orderId);
	await order.fetch();

	if (order.user == null || order.date == null) {
		return res.json({
			hasError: true,
			message: "invalid order.",
		});
	}

	if (!Order.validOrderStatuses.hasOwnProperty(orderStatus)) {
		return res.json({
			hasError: true,
			message: "invalid order status",
		});
	}
	if (orderStatus === order.status) {
		return res.json({
			hasError: false,
		});
	}
	order.status = orderStatus;
	await order.updateStatus();

	return res.json({
		hasError: false,
	});
}

module.exports = {
	getOrders,
	updateOrderStatus,
};
