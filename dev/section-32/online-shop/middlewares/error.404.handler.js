const sessionCartData = require("../util/cart.session");

function handle404Error(req, res, next) {
	const cartData = sessionCartData.getCartSessionData(req, {
		...sessionCartData.defaultCartData,
	});
	res.status(400).render("errors/404", { cartData });
}

module.exports = handle404Error;
