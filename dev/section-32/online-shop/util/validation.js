function userCredentialsAreValid(
	email,
	confirmEmail,
	password,
	fullName,
	street,
	postalCode,
	city
) {
	return (
		email &&
		confirmEmail &&
		password &&
		fullName &&
		street &&
		postalCode &&
		city &&
		email.trim() !== "" &&
		confirmEmail.trim() !== "" &&
		password.trim() !== "" &&
		password.trim().length > 6 &&
		email === confirmEmail &&
		email.includes("@")
	);
}
