const fs = require("fs");
const path = require("path");

const express = require("express");
const ejs = require("ejs");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/confirm", function (req, res) {
  res.render("confirm");
});

app.get("/recommend", function (req, res) {
  res.render("recommend");
});

app.post("/recommend", function (req, res) {
  const dataFilePath = path.join(__dirname, "data", "restaurants.json");
  const restaurantFile = fs.readFileSync(dataFilePath);
  const restaurantData = JSON.parse(restaurantFile);

  const restaurant = req.body;

  restaurantData.push(restaurant);
  fs.writeFileSync(dataFilePath, JSON.stringify(restaurantData));

  res.redirect("/confirm");
});

app.get("/restaurants", function (req, res) {
  const filePath = path.join(__dirname, "data", "restaurants.json");
  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData);
  res.render("restaurants", {
    restaurants: storedRestaurants,
    numberOfRestaurants: storedRestaurants.length,
  });
});

app.listen(3000);
