function getSessionData(req, defaultValues) {
	let sessionInputData = req.session.inputData;

	if (!sessionInputData) {
		sessionInputData = {
			hasError: false,
			...defaultValues,
		};
	}

	req.session.inputData = null;

	return sessionInputData;
}

function flashDataToSession(req, data, action) {
	req.session.inputData = {
		hasError: true,
		...data,
	};
	req.session.save(action);
	return;
}

module.exports = {
	getSessionData: getSessionData,
	flashDataToSession: flashDataToSession,
};
