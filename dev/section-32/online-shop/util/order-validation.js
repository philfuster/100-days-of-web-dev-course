const Product = require("../models/product");

async function orderIsValid(order) {
	return order.items.every(async (item) => {
		const product = new Product(null, null, null, null, null, item.id);
		await product.fetch();
		if (product.name == null) {
			return false;
		}
		return true;
	});
}

module.exports = {
	orderIsValid,
};
