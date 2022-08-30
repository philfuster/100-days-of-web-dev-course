function notFoundHandler(req, res) {
	return res.status(404).render("shared/404");
}

module.exports = notFoundHandler;
