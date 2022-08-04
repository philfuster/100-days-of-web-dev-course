const express = require("express");
const db = require("../data/database");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validation = require("../util/validation");
const validationSession = require("../util/validation-session");

const router = express.Router();

router.get("/signup", function (req, res) {
	let sessionInputData = req.session.inputData;

	if (!sessionInputData) {
		sessionInputData = {
			hasError: false,
			email: "",
			confirmEmail: "",
			password: "",
		};
	}

	req.session.inputData = null;

	res.render("signup", { inputData: sessionInputData });
});

router.get("/login", function (req, res) {
	let sessionInputData = req.session.inputData;

	if (!sessionInputData) {
		sessionInputData = {
			hasError: false,
			email: "",
			confirmEmail: "",
			password: "",
		};
	}

	req.session.inputData = null;

	res.render("login", { inputData: sessionInputData });
});

router.post("/signup", async function (req, res) {
	const { email, password } = req.body;
	const confirmEmail = req.body["confirm-email"];
	if (!validation.userIsValid(email, confirmEmail, password)) {
		validationSession.flashErrorsToSession(
			req,
			{
				message: "Invalid input - check your data.",
				email,
				confirmEmail,
				password,
			},
			function () {
				res.redirect("/signup");
			}
		);
		return;
	}

	const user = new User(email, null, null);
	await user.fetchByEmail();

	if (user != null) {
		validationSession.flashErrorsToSession(
			req,
			{
				message: "User exists already!",
				email,
				confirmEmail,
				password,
			},
			function () {
				res.redirect("/signup");
			}
		);
		return;
	}
	await user.save();
	res.redirect("/login");
});

router.post("/login", async function (req, res) {
	const { email, password } = req.body;

	const existingUser = await db
		.getDb()
		.collection("users")
		.findOne({ email: email });
	if (existingUser == null) {
		req.session.inputData = {
			hasError: true,
			message: "Could not log you in - please check your credentials!",
			email: email,
			password: password,
		};
		req.session.save(function () {
			return res.redirect("/login");
		});
		return;
	}

	const passwordsAreEqual = await bcrypt.compare(
		password,
		existingUser.password
	);

	if (!passwordsAreEqual) {
		req.session.inputData = {
			hasError: true,
			message: "Could not log you in - please check your credentials!",
			email,
			password,
		};
		req.session.save(function () {
			return res.redirect("/login");
		});
		return;
	}
	req.session.user = {
		id: existingUser._id,
		email: existingUser.email,
	};
	req.session.isAuthenticated = true;
	req.session.save(function () {
		res.redirect("/admin");
	});
});

router.post("/logout", function (req, res) {
	req.session.user = null;
	req.session.isAuthenticated = false;
	res.redirect("/");
});

module.exports = router;
