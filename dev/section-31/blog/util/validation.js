function postIsValid(title, content) {
	return (
		title &&
		content &&
		title.trim() !== '' ||
		content.trim() !== ''
	);
}

function userIsValid(email, confirmEmail, password) {
	return (
    email &&
    confirmEmail &&
    password &&
    email.trim() !== '' &&
    confirmEmail.trim() !== '' &&
    password.trim() !== '' &&
    password.trim().length >= 6
	);
}

module.exports = {
	postIsValid: postIsValid,
	userIsValid: userIsValid,
}
