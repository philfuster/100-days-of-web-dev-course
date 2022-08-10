const User = require("../models/user");
const validation = require("../util/validation");
const validationSession = require("../util/validation-session");

function get401(req, res) {
	res.status(401).render("401");
}

function getSignup(req, res) {
	const sessionErrorData = validationSession.getSessionErrorData(req, {
		email: "",
		confirmEmail: "",
		password: "",
		fullName: "",
		street: "",
		postalCode: "",
		city: "",
	});

	res.render("signup", { inputData: sessionErrorData });
}

function getLogin(req, res) {
	const sessionErrorData = validationSession.getSessionErrorData(req, {
		email: "",
		password: "",
	});

	res.render("login", { inputData: sessionErrorData });
}

async function signup(req, res) {
	const { email, confirmEmail, password, name, address, postalCode, city } =
		req.body;
	if (
		!validation.userCredentialsAreValid(
			email,
			confirmEmail,
			password,
			name,
			address,
			postalCode,
			city
		)
	) {
		validationSession.flashErrorsToSession(
			req,
			{
				message: "Please check your input. Password must be at least 6 characters long, postal code must be 5 characters long.",
				email,
				confirmEmail,
				password,
				name,
				address,
				postalCode,
				city,
			},
			function () {
				res.redirect("/signup");
			}
		);
		return;
	}

	const user = new User(email, password, null);
	const existsAlready = await user.existsAlready();
	if (existsAlready) {
		validationSession.flashErrorsToSession(
			req,
			{
				message: "User exists already!",
				email,
				confirmEmail,
				password,
				fullName,
				street,
				postalCode,
				city,
			},
			function () {
				res.redirect("/signup");
			}
		);
		return;
	}

	await user.save();

	res.redirect("/login");
}

async function login(req, res) {
	const { email: enteredEmail, password: enteredPassword } = req.body;

	const user = new User(enteredEmail, enteredPassword);
	const existingUser = await user.getUserWithSameEmail();
	if (!existingUser) {
		validationSession.flashErrorsToSession(
			req,
			{
				message: "Could not log you in - please check your credentials!",
				email: enteredEmail,
				password: enteredPassword,
			},
			function () {
				res.redirect("/login");
			}
		);
		return;
	}
	const success = await user.login(existingUser.password);
	if (!success) {
		validationSession.flashErrorsToSession(
			req,
			{
				message: "Could not log you in - please check your credentials!",
				email: enteredEmail,
				password: enteredPassword,
			},
			function () {
				req.redirect("/login");
			}
		);
		return;
	}
	req.session.user = {
		id: existingUser._id,
		email: existingUser.email,
	};
	req.session.isAuthenticated = true;
	req.session.save(function () {
		res.redirect("/");
	});
}

function logout(req, res) {
	req.session.user = null;
	req.session.isAuthenticated = false;
	res.redirect("/");
}

module.exports = {
	getSignup,
	get401,
	signup,
	getLogin,
	login,
	logout,
};