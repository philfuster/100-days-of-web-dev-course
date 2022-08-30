const Order = require("../models/order.model");

async function getOrders(req, res) {
	const orders = await Order.findAll();
	try {
		res.render("admin/orders/admin-orders", {
			orders: orders,
		});
	} catch (error) {
		next(error);
	}
}

async function updateOrderStatus(req, res) {
	const orderId = req.params.id;
	const newStatus = req.body.newStatus;

	try {
		const order = await Order.findById(orderId);

		order.status = newStatus;

		await order.save();

		res.json({ message: "Order updated", newStatus: newStatus });
	} catch (error) {
		next(error);
	}
}

module.exports = {
	getOrders,
	updateOrderStatus,
};
