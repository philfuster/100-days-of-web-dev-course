const express = require("express");
const ordersController = require("../controllers/orders.controller");
const makeSafe = require("../util/make.safe");

const router = express.Router();

router.get("/", makeSafe(ordersController.getOrders));

router.get("/:id/success", makeSafe(ordersController.getSingleOrder));

router.post("/", makeSafe(ordersController.addOrder));

module.exports = router;
