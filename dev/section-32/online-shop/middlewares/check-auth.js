async function checkAuthStatus(req, res, next) {
	const uid = req.session.uid;
	const isAuth = req.session.isAuth;
	const isAdmin = req.session.isAdmin;

	if (!uid) {
		return next();
	}

	res.locals.uid = uid;
	res.locals.isAuth = isAuth;
	res.locals.isAdmin = isAdmin;
	next();
}

module.exports = checkAuthStatus;
