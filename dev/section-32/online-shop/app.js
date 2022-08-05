const path = require("path");
const express = require("express");

const db = require("./data/database");
const defaultRoutes = require("./routes/default");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));


app.use(defaultRoutes);

app.use(function (error, req, res, next) {
  res.status(500).render("500");
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
