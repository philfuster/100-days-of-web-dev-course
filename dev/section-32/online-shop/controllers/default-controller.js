const cartSession = require("../util/cart-session");

function getHome(req, res) {
	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	res.render("index", { cartData: sessionCartData });
}

module.exports = {
	getHome,
};
