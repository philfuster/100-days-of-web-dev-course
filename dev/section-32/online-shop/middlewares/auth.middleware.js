async function auth(req, res, next) {
	const user = req.session.user;
	const isAuth = req.session.isAuthenticated;
	const isAdmin = req.session.isAdmin;
	if (user == null || !isAuth) {
		return next();
	}
	res.locals.isAuth = isAuth;
	res.locals.isAdmin = isAdmin;
	res.locals.user = user;
	next();
}

module.exports = auth;
