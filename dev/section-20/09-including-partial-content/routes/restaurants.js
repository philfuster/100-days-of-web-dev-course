const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const fs = require("fs");

const resData = require("../util/restaurant-data");

router.get("/restaurants", function (req, res) {
  let order = req.query.order;
  let nextOrder = 'desc';

  if (order !== "asc" && order !== "desc") {
    order = "asc";
  }

  if (order === 'desc') {
    nextOrder = 'asc';
  }
  const storedRestaurants = resData.getStoredRestaurants();

  storedRestaurants.sort(function (resA, resB) {
    if (
      (order === "asc" && resA.name > resB.name) ||
      (order === "desc" && resB.name > resA.name)
    ) {
      return 1;
    }
    return -1;
  });

  return res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
    nextOrder: nextOrder
  });
});

router.get("/restaurants/:id", function (req, res) {
  const { id } = req.params;
  const storedRestaurants = resData.getStoredRestaurants();

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === id) {
      return res.render("restaurant-detail", {
        restaurant,
      });
    }
  }

  res.status(404).render("404");
});

router.get("/recommend", function (req, res) {
  res.render("recommend");
});

router.post("/recommend", function (req, res) {
  const restaurant = req.body;
  restaurant.id = uuid.v4();

  const restaurants = resData.getStoredRestaurants();

  restaurants.push(restaurant);

  resData.storeRestaurants(restaurants);

  res.redirect("/confirm");
});

router.get("/confirm", function (req, res) {
  res.render("confirm");
});

module.exports = router;
