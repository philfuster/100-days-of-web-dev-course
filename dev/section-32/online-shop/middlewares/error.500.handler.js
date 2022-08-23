const sessionCartData = require("../util/cart.session");

function handleErrors(error, req, res, next) {
	console.log(error);
	const cartData = sessionCartData.getCartSessionData(req, {
		...sessionCartData.defaultCartData,
	});
	res.status(500).render("errors/500", { cartData });
}

module.exports = handleErrors;
