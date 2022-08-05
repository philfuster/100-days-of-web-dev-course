const User = require('../models/user');
const validation = require("../util/validation");
const validationSession = require("../util/validation-session");

function getSignup(req, res) {
	const sessionErrorData = validationSession.getSessionErrorData(
		req,
		{
			email: '',
			confirmEmail: '',
			password: ''
		}
	);

	res.render("signup", { inputData: sessionErrorData});
}

function getLogin(req, res) {
	const sessionErrorData = validationSession.getSessionErrorData(
		req,
		{
			email: '',
			password: ''
		}
	);
	res.render("login", { inputData: sessionErrorData});
}

async function createUser(req, res) {
	const { email, password } = req.body;
	const confirmEmail = req.body["confirm-email"];
	if (!validation.userCredentialsAreValid(email, confirmEmail, password)) {
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
	const existsAlready = await user.existsAlready();
	if (existsAlready) {
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
	user.password = password;
	await user.create();

	res.redirect("/login");
}

async function loginUser(req, res) {
	const { email: enteredEmail, password: enteredPassword } = req.body;

	const user = new User(enteredEmail, enteredPassword);
	const existingUser = await user.getUserWithSameEmail();
	if (!existingUser) {
		validationSession.flashErrorsToSession(
			req,
			{
				message: 'Could not log you in - please check your credentials!',
				email: enteredEmail,
				password: enteredPassword,
			},
			function () {
				res.redirect("/login")
			}
		)
		return;
	}

	const passwordsAreEqual = user.comparePassword(enteredPassword);
	if (!passwordsAreEqual) {
		validationSession.flashErrorsToSession(
			req,
			{
				message: 'Could not log you in - please check your credentials!',
				email: enteredEmail,
				password: enteredPassword,
			},
			function () {
				res.redirect("/login")
			}
		)
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
}

function logoutUser(req, res) {
	req.session.user = null;
	req.session.isAuthenticated = false;
	res.redirect("/");
}

function get401(req, res) {
	res.status(401).render('401');
}

module.exports = {
	createUser: createUser,
	getLogin: getLogin,
	getSignup: getSignup,
	loginUser: loginUser,
	logoutUser: logoutUser,
	get401: get401,
}
