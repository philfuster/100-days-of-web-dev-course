const sessionCartData = require("../util/cart.session");

function handleErrors(error, req, res, next) {
	console.log(error);
	const cartData = sessionCartData.getCartSessionData(req, {
		...sessionCartData.defaultCartData,
	});
	if (error.code === 404) {
		return res.status(404).render("shared/404", { cartData });
	}
	res.status(500).render("shared/500", { cartData });
}

module.exports = handleErrors;
