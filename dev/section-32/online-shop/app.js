const path = require("path");
const express = require("express");
const csurf = require("csurf");

const sessionConfig = require("./config/session");
const authMiddleware = require("./middlewares/auth-middleware");
const addCSRFTokenMiddleware = require("./middlewares/csrf-token-middleware.js");
const db = require("./data/database");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const defaultRoutes = require("./routes/default");
const authRoutes = require("./routes/auth");
const shopRoutes = require("./routes/shop");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use(express.urlencoded({ extended: false }));

app.use(sessionConfig.createSessionStore());
app.use(csurf());

app.use(addCSRFTokenMiddleware);
app.use(authMiddleware);

app.use(defaultRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase().then(function () {
	app.listen(3000);
});
