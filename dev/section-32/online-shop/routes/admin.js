const express = require("express");
const adminController = require("../controllers/admin.controller");
const makeSafe = require("../util/make-safe");
const guardAdminRoute = require("../middlewares/auth-admin-protection-middleware");

const router = express.Router();
