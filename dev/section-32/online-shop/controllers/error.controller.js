const cartSession = require("../util/cart.session");

function get401(req, res) {
	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	res.status(401).render("errors/401", { cartData: sessionCartData });
}

function get404(req, res) {
	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	res.status(404).render("errors/404", { cartData: sessionCartData });
}
function get500(req, res) {
	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	res.status(500).render("errors/500", { cartData: sessionCartData });
}

module.exports = {
	get401,
	get404,
	get500,
};
