const User = require("../models/user");
const validation = require("../util/validation");
const validationSession = require("../util/validation-session")

function get401(req, res) {
	res.status(401).render('401');

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

async function signup(req, res) {
	const { email, confirmEmail, password, fullName, street, postalCode, city } =
		req.body;
	if (
		!validation.userCredentialsAreValid(
			email,
			confirmEmail,
			password,
			fullName,
			street,
			postalCode,
			city
		)
	) {
		validationSession.flashErrorsToSession(
			req,
			{
				message: 'Invalid input - check your data.',
				email,
				confirmEmail,
				password,
				fullName,
				street,
				postalCode,
				city
			},
			function () {
				res.redirect('/signup');
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
				message: 'User exists already!',
				email,
				confirmEmail,
				password,
				fullName,
				street,
				postalCode,
				city
			},
			function () {
				res.redirect('/signup');
			}
		);
		return;
	}

	await user.save();

	res.redirect('/login');
}

module.exports = {
	getSignup,
	get401,
	signup
};
