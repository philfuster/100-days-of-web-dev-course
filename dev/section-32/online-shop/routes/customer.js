const express = require("express");
const customerController = require("../controllers/customer-controller");
const makeSafe = require("../util/make-safe");
const guardRoute = require("../middlewares/auth-protection-middleware");

const router = express.Router();

router.get("/products", customerController.getProducts);

router.get("/products/:id", makeSafe(customerController.getSingleProduct));

router.post("/products/:id", makeSafe(customerController.addProductToCart));

router.get("/cart", makeSafe(customerController.getCart));

router.post("/cart/add", makeSafe(customerController.addProductToCart));

router.post("/cart/update", makeSafe(customerController.updateItemQuantity));

router.use(guardRoute);

router.post("/cart/checkout", makeSafe(customerController.checkOut));

module.exports = router;
