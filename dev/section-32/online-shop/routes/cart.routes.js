const express = require("express");
const cartController = require("../controllers/cart.controller");
const makeSafe = require("../util/make.safe");

const router = express.Router();

router.get("/cart", makeSafe(cartController.getCart));

router.post("/cart/add", makeSafe(cartController.addProductToCart));

router.post("/cart/update", makeSafe(cartController.updateItemQuantity));

router.post("/cart/deleteItem", makeSafe(cartController.removeItemFromCart));

module.exports = router;
