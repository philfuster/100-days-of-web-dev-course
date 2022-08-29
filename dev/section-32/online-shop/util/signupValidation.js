function isEmpty(value) {
	return !value || value.trim() === "";
}

function userCredentialsAreValid(email, password) {
	return (
		email && email.includes("@") && password && password.trim().length >= 6
	);
}

function emailIsConfirmed(email, confirmEmail) {
	return email === confirmEmail;
}

function userDetailsAreValid(
	email,
	confirmEmail,
	password,
	name,
	address,
	postalCode,
	city
) {
	return (
		userCredentialsAreValid(email, password) &&
		!isEmpty(email) &&
		!isEmpty(confirmEmail) &&
		!isEmpty(password) &&
		!isEmpty(name) &&
		!isEmpty(address) &&
		!isEmpty(postalCode) &&
		!isEmpty(city) &&
		postalCode.trim().length === 5
	);
}

module.exports = {
	userDetailsAreValid: userDetailsAreValid,
	emailIsConfirmed: emailIsConfirmed,
};
