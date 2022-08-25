const Order = require("../models/order");
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

module.exports = {
	getOrders,
};
