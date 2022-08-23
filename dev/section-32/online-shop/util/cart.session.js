function getCartSessionData(req, defaultValues) {
	let sessionCartData = req.session.cartData;

	if (!sessionCartData) {
		sessionCartData = {
			...defaultValues,
		};
	}

	return sessionCartData;
}

function setCartSessionData(req, sessionCartData, action) {
	req.session.cartData = {
		...sessionCartData,
	};
	req.session.save(action);
	return;
}

const defaultCartData = {
	items: [],
	totalPrice: 0,
	quantity: 0,
};

module.exports = {
	getCartSessionData,
	setCartSessionData,
	defaultCartData,
};
