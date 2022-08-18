function guardAdminRoute(req, res, next) {
	if (!res.locals.isAuth || !res.locals.isAdmin) {
		return res.redirect("401");
	}
	next();
}

module.exports = guardAdminRoute;
