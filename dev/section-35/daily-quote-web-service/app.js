const path = require("path");
const express = require("express");

const db = require("./data/database");
const quotesRoutes = require("./routes/quotes.routes");

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use("/quote", quotesRoutes);

app.use(function (error, req, res, next) {
  res.status(500).json({
    message: "something went wrong",
  });
});

db.initDb()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("connecting to the database failed");
  });
