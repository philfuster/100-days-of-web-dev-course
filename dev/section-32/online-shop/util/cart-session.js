function getCartSessionData(req, defaultValues) {
	let sessionCartData = req.session.cartData;

	if (!sessionCartData) {
		sessionCartData = {
			...defaultValues,
		};
	}

	req.session.cartData = null;

	return sessionCartData;
}

function setSessionCartData(req, sessionCartData, action) {
	req.session.cartData = {
		...sessionCartData,
	};
	req.session.save(action);
	return;
}

module.exports = {
	getCartSessionData,
	setSessionCartData,
};
