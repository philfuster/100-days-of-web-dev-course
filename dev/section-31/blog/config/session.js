const session = require("express-session");
const mongodbStore = require('connect-mongodb-session');

function createSessionStore() {
	const MongoDBStore = mongodbStore(session);

	const sessionStore = new MongoDBStore({
		uri: 'mongodb://localhost:27017',
		databaseName: 'blog',
		collection: 'sessions'
	});
	const sessionConfig = {
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
		cookie: {
			maxAge: 2 * 24 * 60 * 60 * 1000,
		},
	}
	return session(sessionConfig);
}

module.exports = {
	createSessionStore,
}
