const express = require("express");
const customerController = require("../controllers/customer-controller");
const makeSafe = require("../util/make-safe");

const router = express.Router();

router.get("/products", customerController.getProducts);

router.get("/products/:id", makeSafe(customerController.getSingleProduct));

router.post("/products/:id", makeSafe(customerController.addProductToCart));

router.get("/cart", makeSafe(customerController.getCart));

router.post("/cart/add", makeSafe(customerController.addProductToCart));

module.exports = router;
