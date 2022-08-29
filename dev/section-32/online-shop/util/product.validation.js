const Product = require("../models/product.model");

async function productIsValid(product) {
	return (
		product.title &&
		product.summary &&
		product.description &&
		product.image &&
		product.price &&
		product.price > 0
	);
}

module.exports = {
	productIsValid,
};
