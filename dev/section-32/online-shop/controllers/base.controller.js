const cartSession = require("../util/cart.session");

function getHome(req, res) {
	res.redirect("/products");
}

function get401(req, res) {
	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	res.status(401).render("shared/401", { cartData: sessionCartData });
}

function get403(req, res) {
	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	res.status(403).render("shared/403", { cartData: sessionCartData });
}

function get404(req, res) {
	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	res.status(404).render("shared/404", { cartData: sessionCartData });
}

function get500(req, res) {
	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	res.status(500).render("shared/500", { cartData: sessionCartData });
}
module.exports = {
	getHome,
	get401,
	get403,
	get404,
	get500,
};
