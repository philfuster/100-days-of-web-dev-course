function userCredentialsAreValid(
	email,
	confirmEmail,
	password,
	name,
	address,
	postalCode,
	city
) {
	return (
		email &&
		confirmEmail &&
		password &&
		name &&
		address &&
		postalCode &&
		city &&
		email.trim() !== "" &&
		confirmEmail.trim() !== "" &&
		postalCode.trim() !== "" &&
		postalCode.trim().length === 5 &&
		password.trim() !== "" &&
		password.trim().length >= 6 &&
		email === confirmEmail &&
		email.includes("@")
	);
}

module.exports = {
	userCredentialsAreValid,
};
