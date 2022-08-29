const express = require("express");

const adminOrderRoutes = require("./admin.order.routes");
const adminProductRoutes = require("./admin.product.routes");

const router = express.Router();

router.use(adminProductRoutes);
router.use(adminOrderRoutes);

module.exports = router;
