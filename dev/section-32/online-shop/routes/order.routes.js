const express = require("express");
const orderController = require("../controllers/order.controller");
const makeSafe = require("../util/make.safe");

const router = express.Router();

router.get("/orders", makeSafe(orderController.getOrders));

router.get("/orders/:id/success", makeSafe(orderController.getSingleOrder));

router.post("/orders/checkout", makeSafe(orderController.checkOut));

module.exports = router;
