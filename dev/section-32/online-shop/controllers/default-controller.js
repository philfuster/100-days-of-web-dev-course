const cartSession = require('../util/cart-session');

function getHome(req, res) {
	const sessionCartData = cartSession.getCartSessionData(req, {
		items: [],
		cartTotalPrice: 0,
		quantity: 0
	})
	res.render("index", {cartData: sessionCartData});
}

module.exports = {
	getHome,
};
