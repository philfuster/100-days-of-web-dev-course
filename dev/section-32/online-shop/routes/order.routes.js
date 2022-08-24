const express = require("express");
const orderController = require("../controllers/order.controller");
const makeSafe = require("../util/make.safe");
const guardRoute = require("../middlewares/auth.protection.middleware");

const router = express.Router();

router.use(guardRoute);

router.get("/orders", makeSafe(orderController.getOrders));

module.exports = router;
