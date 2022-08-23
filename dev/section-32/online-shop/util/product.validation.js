const Product = require("../models/product");

async function productIsValid(product) {
	return (
		product.name &&
		product.summary &&
		product.description &&
		product.imagePath &&
		product.price &&
		product.price > 0
	);
}

module.exports = productIsValid;
