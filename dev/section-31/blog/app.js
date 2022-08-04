const path = require('path');
const express = require('express');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session');
const csrf = require('csurf');

const db = require('./data/database');
const blogRoutes = require('./routes/blog');

const MongoDBStore = mongodbStore(session);

const app = express();

const sessionStore = new MongoDBStore({
	uri: 'mongodb://localhost:27017',
	databaseName: 'blog',
	collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
		cookie: {
			maxAge: 2 * 24 * 60 * 60 * 1000,
		},
	}),
);
app.use(csrf());

app.use(function(req, res, next) {
	const user = req.session.user;
	const isAuth = req.session.isAuthenticated;
	if (user == null || !isAuth ) {
		return next();
	}
	res.locals.isAuth = isAuth;
	res.locals.user = user;
	res.locals.csrfToken = req.csrfToken();
	next();
})

app.use(blogRoutes);

app.use(function (error, req, res, next) {
	console.log(req);
	console.log(error);
	res.status(500).render('500');
});

db.connectToDatabase().then(function () {
	app.listen(3000);
});
