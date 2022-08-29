const path = require("path");
const express = require("express");
const csurf = require("csurf");

const sessionConfig = require("./config/session");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const addCSRFTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const db = require("./data/database");
const protectRoutes = require("./middlewares/protect-routes");
const baseRoutes = require("./routes/base.routes");
const authRoutes = require("./routes/auth.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const productRoutes = require("./routes/product.routes");
const adminRoutes = require("./routes/admin/admin.routes");

const app = express();

global.__basedir = __dirname;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(sessionConfig.createSessionStore());
app.use(csurf());

app.use(addCSRFTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(errorHandlerMiddleware);
app.use(protectRoutes);
app.use(orderRoutes);
app.use("/admin", adminRoutes);

db.connectToDatabase()
	.then(function () {
		app.listen(3000);
	})
	.catch(function (error) {
		console.log("Failed to connect to the database!");
		console.log(error);
	});
