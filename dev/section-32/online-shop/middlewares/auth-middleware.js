async function auth(req, res, next) {
	const user = req.session.user;
	const isAuth = req.session.isAuthenticated;
	const isAdmin = req.session.isAdmin;
	if (user == null || !isAuth) {
		return next();
	}
	if (isAdmin) res.locals.isAdmin = true;
	res.locals.isAuth = isAuth;
	res.locals.user = user;
	next();
}

module.exports = auth;
