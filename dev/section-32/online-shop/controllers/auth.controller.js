const User = require("../models/user.model");
const userSession = require("../util/user.session");
const validation = require("../util/signupValidation");
const sessionFlash = require("../util/session-flash");
const cartSession = require("../util/cart.session");

function getSignup(req, res) {
	const sessionData = sessionFlash.getSessionData(req, {
		email: "",
		confirmEmail: "",
		password: "",
		fullName: "",
		street: "",
		postalCode: "",
		city: "",
	});
	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});
	res.render("customer/auth/signup", {
		inputData: sessionData,
		cartData: sessionCartData,
	});
}

function getLogin(req, res) {
	const sessionData = sessionFlash.getSessionData(req, {
		email: "",
		password: "",
	});
	const sessionCartData = cartSession.getCartSessionData(req, {
		...cartSession.defaultCartData,
	});

	res.render("customer/auth/login", {
		inputData: sessionData,
		cartData: sessionCartData,
	});
}

async function signup(req, res) {
	const { email, confirmEmail, password, name, address, postalCode, city } =
		req.body;
	if (
		!validation.userDetailsAreValid(
			email,
			confirmEmail,
			password,
			name,
			address,
			postalCode,
			city
		) ||
		!validation.emailIsConfirmed(email, confirmEmail)
	) {
		sessionFlash.flashDataToSession(
			req,
			{
				message:
					"Please check your input. Password must be at least 6 characters long, postal code must be 5 characters long.",
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

	const user = new User(email, password, name, address, postalCode, city, null);

	const existsAlready = await user.existsAlready();
	if (existsAlready) {
		sessionFlash.flashDataToSession(
			req,
			{
				message: "User exists already! Try logging in instead.",
				email,
				confirmEmail,
				password,
				name,
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
		sessionFlash.flashDataToSession(
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
	const passwordIsCorrect = await user.hasMatchingPassword(
		existingUser.password
	);
	if (!passwordIsCorrect) {
		sessionFlash.flashDataToSession(
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
	userSession.createUserSession(req, existingUser, function () {
		res.redirect("/products");
	});
	return;
}

function logout(req, res) {
	userSession.destroyUserAuthSession(req);
	res.redirect("/");
}

module.exports = {
	getSignup,
	signup,
	getLogin,
	login,
	logout,
};
