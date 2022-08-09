async function auth(req, res, next) {
	const user = req.session.user;
	const isAuth = req.session.isAuthenticated;
	if (user == null || !isAuth) {
		return next();
	}
	res.locals.isAuth = isAuth;
	res.locals.user = user;
	next();
}

module.exports = auth;
