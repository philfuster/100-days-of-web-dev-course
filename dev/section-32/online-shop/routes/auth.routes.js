const express = require("express");
const makeSafe = require("../util/make.safe");
const authController = require("../controllers/auth.controller.js");

const router = express.Router();

router.get("/signup", authController.getSignup);

router.get("/login", authController.getLogin);

router.post("/signup", makeSafe(authController.signup));

router.post("/login", makeSafe(authController.login));

router.post("/logout", authController.logout);

module.exports = router;
