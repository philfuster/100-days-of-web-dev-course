const express = require("express");
const multerConfig = require("../config/multer.config");
const adminProductController = require("../controllers/admin.product.controller");
const makeSafe = require("../util/make.safe");
const guardAdminRoute = require("../middlewares/admin.protection.middleware");

const router = express.Router();

router.use(guardAdminRoute);

router.get("/admin/products", makeSafe(adminProductController.getProducts));

router.get("/admin/products/new", adminProductController.getNewProductForm);

router.get(
	"/admin/products/:id",
	makeSafe(adminProductController.getSingleProduct)
);

router.post(
	"/admin/products/new",
	multerConfig.upload.single("image"),
	makeSafe(adminProductController.createProduct)
);

router.post(
	"/admin/products/:id",
	multerConfig.upload.single("image"),
	makeSafe(adminProductController.saveProduct)
);

router.post(
	"/admin/products/:id/delete",
	makeSafe(adminProductController.deleteProduct)
);

module.exports = router;
