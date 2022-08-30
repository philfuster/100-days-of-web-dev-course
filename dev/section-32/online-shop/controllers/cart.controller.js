const cartSession = require("../util/cart.session");
const Product = require("../models/product.model");

async function getCart(req, res) {
	res.render("customer/cart/cart");
}

async function addCartItem(req, res) {
	const { productId } = req.body;

	const product = await Product.findById(productId);

	const cart = res.locals.cart;
	cart.addItem(product);
	req.session.cart = cart;
	res.status(201).json({
		message: "Cart updated!",
		newTotalItems: cart.totalQuantity,
	});
}

async function updateCartItem(req, res) {
	const { productId, quantity } = req.body;
	const cart = res.locals.cart;

	const updatedItemData = cart.updateItem(productId, +quantity);

	req.session.cart = cart;

	res.json({
		message: "Item updated!",
		updatedCartData: {
			newTotalQuantity: cart.totalQuantity,
			newTotalPrice: cart.totalPrice,
			updatedItemPrice: updatedItemData.updatedItemPrice,
		},
	});
}

module.exports = {
	getCart,
	addCartItem: addCartItem,
	updateCartItem: updateCartItem,
};
