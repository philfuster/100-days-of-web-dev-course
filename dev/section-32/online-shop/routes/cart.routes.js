const express = require("express");
const cartController = require("../controllers/cart.controller");
const makeSafe = require("../util/make.safe");

const router = express.Router();

router.get("/", makeSafe(cartController.getCart));

router.post("/items", makeSafe(cartController.addCartItem));

router.patch("/items", makeSafe(cartController.updateCartItem));

module.exports = router;
