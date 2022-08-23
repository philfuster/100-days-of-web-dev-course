const Product = require("../models/product");

async function orderIsValid(order) {
	return (
		order.items &&
		order.totalPrice &&
		order.totalQuantity &&
		order.items.length > 0 &&
		order.items.every(async (item) => {
			const product = new Product(null, null, null, null, null, item.id);
			await product.fetch();
			if (product.name == null) {
				return false;
			}
			return true;
		}) &&
		order.totalPrice > 0 &&
		order.totalQuantity > 0
	);
}

module.exports = {
	orderIsValid,
};
