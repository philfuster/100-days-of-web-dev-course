const path = require("path");
const express = require("express");
const csrf = require("csurf");

const sessionConfig = require("./config/session");
const authMiddleware = require("./middlewares/auth-middleware")
const addCSRFTokenMiddleware = require("./middlewares/csrf-token-middleware");
const db = require("./data/database");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(sessionConfig.createSessionStore());
app.use(csrf());

app.use(addCSRFTokenMiddleware);
app.use(authMiddleware);

app.use(authRoutes);
app.use(blogRoutes);

app.use(function (error, req, res, next) {
	res.status(500).render("500");
});

db.connectToDatabase().then(function () {
	app.listen(3000);
});
