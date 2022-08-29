const express = require("express");
const productController = require("../controllers/product.controller");
const makeSafe = require("../util/make.safe");

const router = express.Router();

router.get("/products", productController.getProducts);

router.get("/products/:id", makeSafe(productController.getProductDetails));

router.post("/products/:id", makeSafe(productController.addProductToCart));

module.exports = router;
