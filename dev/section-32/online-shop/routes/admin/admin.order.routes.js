const express = require("express");

const adminOrderController = require("../../controllers/admin.order.controller");
const makeSafe = require("../../util/make.safe");
const router = express.Router();

router.get("/orders", makeSafe(adminOrderController.getOrders));

router.post(
	"/orders/:id/updateStatus",
	makeSafe(adminOrderController.updateOrderStatus)
);

module.exports = router;
