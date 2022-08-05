const express = require("express");
const authController = require("../controllers/auth-controller");
const guardRoute = require("../middlewares/auth-protection-middleware");
const router = express.Router();

router.get('/401', authController.get401);

router.get("/signup", authController.getSignup);

router.get("/login", authController.getLogin);

router.post("/signup", authController.createUser);

router.post("/login", authController.loginUser);

router.post("/logout", authController.logoutUser);

module.exports = router;
