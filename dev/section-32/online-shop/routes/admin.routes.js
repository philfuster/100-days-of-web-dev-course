const express = require("express");
const multerConfig = require("../config/multer.config");
const adminController = require("../controllers/admin.controller");
const makeSafe = require("../util/make.safe");
const guardAdminRoute = require("../middlewares/admin.protection.middleware");

const router = express.Router();

router.use(guardAdminRoute);

router.get("/admin/products", makeSafe(adminController.getProducts));

router.get("/admin/products/new", adminController.getNewProductForm);

router.get("/admin/products/:id", makeSafe(adminController.getSingleProduct));

router.post(
	"/admin/products/:id",
	multerConfig.upload.single("image"),
	makeSafe(adminController.saveProduct)
);

router.post(
	"/admin/products/new",
	multerConfig.upload.single("image"),
	makeSafe(adminController.saveNewProduct)
);

module.exports = router;
