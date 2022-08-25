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
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const productRoutes = require("./routes/product.routes");
const adminProductRoutes = require("./routes/admin.product.routes");
const adminOrderRoutes = require("./routes/admin.order.routes");
const errorRoutes = require("./routes/error.routes");

const app = express();

global.__basedir = __dirname;

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
app.use(productRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(adminProductRoutes);
app.use(adminOrderRoutes);

app.use(error404HandlerMiddleware);
app.use(error500HandlerMiddleware);

db.connectToDatabase().then(function () {
	app.listen(3000);
});
