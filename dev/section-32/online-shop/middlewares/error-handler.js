const sessionCartData = require("../util/cart-session");
function handleErrors(error, req, res, next) {
	console.log(error);
	const cartData = sessionCartData.getCartSessionData(req, {
		items: [],
		cartTotalPrice: 0,
		quantity: 0,
	});
	res.status(500).render("500", { cartData });
}

module.exports = handleErrors;
