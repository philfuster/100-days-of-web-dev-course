const express = require("express");
const errorController = require("../controllers/error.controller.js");

const router = express.Router();

router.get("/401", errorController.get401);

router.get("/404", errorController.get404);

router.get("/500", errorController.get500);

module.exports = router;
