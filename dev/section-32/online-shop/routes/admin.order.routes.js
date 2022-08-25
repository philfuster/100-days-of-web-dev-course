const express = require("express");

const adminOrderController = require("../controllers/admin.order.controller");
const makeSafe = require("../util/make.safe");
const guardAdminRoute = require("../middlewares/admin.protection.middleware");

const router = express.Router();

router.use(guardAdminRoute);

router.get("/admin/orders", makeSafe(adminOrderController.getOrders));

router.post(
	"/admin/orders/:id/updateStatus",
	makeSafe(adminOrderController.updateOrderStatus)
);

module.exports = router;
