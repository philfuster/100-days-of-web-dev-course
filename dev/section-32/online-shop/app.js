const path = require("path");
const express = require("express");
const csurf = require("csurf");

const sessionConfig = require("./config/session");
const authMiddleware = require("./middlewares/auth.middleware");
const addCSRFTokenMiddleware = require("./middlewares/csrf.token.middleware");
const error500HandlerMiddleware = require("./middlewares/error.500.handler");
const error404HandlerMiddleware = require("./middlewares/error.404.handler");
const db = require("./data/database");
const defaultRoutes = require("./routes/default.routes");
const authRoutes = require("./routes/auth.router");
const shopRoutes = require("./routes/customer.routes");
const adminRoutes = require("./routes/admin.routes");
const errorRoutes = require("./routes/error.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(sessionConfig.createSessionStore());
app.use(csurf());

app.use(addCSRFTokenMiddleware);
app.use(authMiddleware);

app.use(defaultRoutes);
app.use(errorRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(adminRoutes);

app.use(error404HandlerMiddleware);
app.use(error500HandlerMiddleware);

db.connectToDatabase().then(function () {
	app.listen(3000);
});
