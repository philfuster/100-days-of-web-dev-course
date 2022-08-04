const express = require('express');
const db = require('../data/database');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');


const router = express.Router();

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/signup', function (req, res) {
	let sessionInputData = req.session.inputData;

	if (!sessionInputData) {
		sessionInputData = {
			hasError: false,
			email: '',
			confirmEmail: '',
			password: '',
		};
	}

	req.session.inputData = null;
	const csrfToken = req.csrfToken();

	res.render('signup', { inputData: sessionInputData, csrfToken });
});

router.get('/login', function (req, res) {
	let sessionInputData = req.session.inputData;

	if (!sessionInputData) {
		sessionInputData = {
			hasError: false,
			email: '',
			confirmEmail: '',
			password: '',
		};
	}

	req.session.inputData = null;
	const csrfToken = req.csrfToken();

	res.render('login', { inputData: sessionInputData, csrfToken });
});

router.post('/signup', async function (req, res) {
	const { email, password } = req.body;
	const confirmEmail = req.body['confirm-email'];
	if (
		email == null ||
		confirmEmail == null ||
		password == null ||
		password.trim().length < 6 ||
		email !== confirmEmail ||
		!email.includes('@')
	) {
		req.session.inputData = {
			hasError: true,
			message: 'Invalid input - please check your data.',
			email,
			confirmEmail,
			password,
		};
		req.session.save(function () {
			return res.redirect('/signup');
		});
		return;
	}
	const existingUser = await db.getDb().collection('users').findOne({ email: email });
	if (existingUser != null) {
		req.session.inputData = {
			hasError: true,
			message: 'User exists already!',
			email,
			confirmEmail,
			password,
		};
		req.session.save(function () {
			return res.redirect('/signup');
		});
		return;
	}

	const hashedPassword = await bcrypt.hash(password, 12);

	const newUser = {
		email,
		password: hashedPassword,
	};

	await db.getDb().collection('users').insertOne(newUser);

	res.redirect('/login');
});

router.post('/login', async function (req, res) {
	const { email, password } = req.body;

	const existingUser = await db.getDb().collection('users').findOne({ email: email });
	if (existingUser == null) {
		req.session.inputData = {
			hasError: true,
			message: 'Could not log you in - please check your credentials!',
			email: email,
			password: password,
		};
		req.session.save(function () {
			return res.redirect('/login');
		});
		return;
	}

	const passwordsAreEqual = await bcrypt.compare(password, existingUser.password);

	if (!passwordsAreEqual) {
		req.session.inputData = {
			hasError: true,
			message: 'Could not log you in - please check your credentials!',
			email,
			password,
		};
		req.session.save(function () {
			return res.redirect('/login');
		});
		return;
	}
	req.session.user = {
		id: existingUser._id,
		email: existingUser.email,
	};
	req.session.isAuthenticated = true;
	req.session.save(function () {
		res.redirect('/admin');
	});
});


router.get('/admin', async function (req, res) {
	if (!res.locals.isAuth) {
		return res.status(401).render('401');
	}
	let sessionInputData = req.session.inputData;

	if (!sessionInputData) {
		sessionInputData = {
			hasError: false,
			title: '',
			content: '',
		};
	}

	req.session.inputData = null;

	const posts = await db.getDb().collection('posts').find({}).toArray();
	res.render('admin', { inputData: sessionInputData, posts });
});

router.post('/admin', async function (req, res) {
	if (!res.locals.isAuth) {
		return res.status(401).render('401');
	}
	const { title, content } = req.body;
	if (
		title == null ||
		title.length < 1 ||
		content == null ||
		content.length < 1
	) {
		req.session.inputData = {
			hasError: true,
			message: 'Invalid input - please check your data.',
			title,
			content
		};
		req.session.save(function () {
			return res.redirect('/admin');
		});
		return;
	}

	await db.getDb().collection('posts').insertOne({
		title,
		content
	});

	res.redirect('/admin')
})

router.get('/admin/:id/posts', async function (req, res) {
	if (!res.locals.isAuth) {
		return res.status(401).render('401');
	}
	const { title, content, id } = req.body;
	if (
		title == null ||
		title.length < 1 ||
		content == null ||
		content.length < 1
	) {
		req.session.inputData = {
			hasError: true,
			message: 'Invalid input - please check your data.',
			title,
			content
		};
		req.session.save(function () {
			return res.redirect('/admin');
		});
		return;
	}
	const existingPost = await db.getDb().collection('posts').findOne({_id: ObjectId(id) });
	console.log(existingPost);
	if (existingPost == null) {
		res.status(400).render('400');
	}
	await db.getDb().collection('posts').updateOne({_id: ObjectId(id)}, { $set: {
		title,
		content
	}});

	res.redirect('/admin')
})

router.post('/logout', function (req, res) {
	req.session.user = null;
	req.session.isAuthenticated = false;
	res.locals.csrfToken = null;
	res.redirect("/");
});

module.exports = router;
