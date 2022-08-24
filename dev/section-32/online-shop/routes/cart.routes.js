const express = require("express");
const cartController = require("../controllers/cart.controller");
const makeSafe = require("../util/make.safe");
const guardRoute = require("../middlewares/auth.protection.middleware");

const router = express.Router();

router.get("/cart", makeSafe(cartController.getCart));

router.post("/cart/add", makeSafe(cartController.addProductToCart));

router.post("/cart/update", makeSafe(cartController.updateItemQuantity));

router.post("/cart/deleteItem", makeSafe(cartController.removeItemFromCart));

router.use(guardRoute);

router.post("/cart/checkout", makeSafe(cartController.checkOut));

module.exports = router;
