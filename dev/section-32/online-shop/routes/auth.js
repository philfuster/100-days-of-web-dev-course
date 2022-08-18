const express = require("express");
const authController = require("../controllers/auth.controller.js");

const router = express.Router();

router.get("/401", authController.get401);

router.get("/404", authController.get404);

router.get("/500", authController.get500);

router.get("/signup", authController.getSignup);

router.get("/login", authController.getLogin);

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

module.exports = router;
