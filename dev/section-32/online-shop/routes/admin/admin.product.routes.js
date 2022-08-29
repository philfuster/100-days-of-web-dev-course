const express = require("express");
const imageUploadMiddleware = require("../../middlewares/image-upload");
const adminProductController = require("../../controllers/admin.product.controller");
const makeSafe = require("../../util/make.safe");

const router = express.Router();

router.get("/products", makeSafe(adminProductController.getProducts));

router.get("/products/new", adminProductController.getNewProductForm);

router.get("/products/:id", makeSafe(adminProductController.getUpdateProduct));

router.post(
	"/products/new",
	imageUploadMiddleware,
	makeSafe(adminProductController.createProduct)
);

router.post(
	"/products/:id",
	imageUploadMiddleware,
	makeSafe(adminProductController.updateProduct)
);

router.delete("/products/:id", makeSafe(adminProductController.deleteProduct));

module.exports = router;
