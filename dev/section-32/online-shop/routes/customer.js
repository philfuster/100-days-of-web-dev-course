const express = require("express");
const shopController = require("../controllers/customer-controller");
const makeSafe = require("../util/make-safe");

const router = express.Router();

router.get("/products", shopController.getProducts);

router.get("/products/:id", makeSafe(shopController.getSingleProduct));

router.post("/products/:id", makeSafe(shopController.addProductToCart));

router.get("/cart", makeSafe(shopController.getCart));

module.exports = router;
