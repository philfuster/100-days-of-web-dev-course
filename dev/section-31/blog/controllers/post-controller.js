const Post = require("../models/Post");
const validation = require("../util/validation");
const validationSession = require("../util/validation-session");

function getHome(req, res) {
	res.render("index");
}

async function getAdmin(req, res) {
	if (!res.locals.isAuth) {
		return res.status(401).render("401");
	}

	const sessionErrorData = validationSession.getSessionErrorData(
		req,
		{
			title: '',
			content: ''
		}
	);
	const posts = await Post.fetchAll();

	res.render("admin", { inputData: sessionErrorData, posts });
}

async function createPost(req, res) {
	if (!res.locals.isAuth) {
		return res.status(401).render("401");
	}
	const { title, content } = req.body;
	if (!validation.postIsValid(title, content)) {
		validationSession.flashErrorsToSession(
			req,
			{
				message: 'Invalid input - please check your data.',
				title,
				content
			},
			function () {
				res.redirect("/admin")
			}
		);
		return;
	}

	const post = new Post(title, content);
	await post.save();

	res.redirect("/admin");
}

async function getSinglePost(req, res) {
	if (!res.locals.isAuth) {
		return res.status(401).render("401");
	}
	const { id } = req.params;
	const post = new Post(null, null, id);
	await post.fetch();

	if (!post.title || !post.content) {
		return res.status(400).render("400");
	}

	const sessionErrorData = validationSession.getSessionErrorData(req, {
		title: post.title,
		content: post.content
	});

	res.render("single-post", { inputData: sessionErrorData, post });
}

async function updatePost(req, res) {
	const { title, content } = req.body;
	const { id } = req.params;
	if (
		!validation.postIsValid(title, content)
	) {
		validationSession.flashErrorsToSession(
			req,
			{
				message: "Invalid input - please check your data.",
				title,
				content,
			},
			function () {
				res.redirect(`/posts/${id}/edit`);
			}
		);
		return;
	}

	const post = new Post(title, content, id);

	await post.save();
	res.redirect("/admin");
}

async function deletePost(req, res) {
	const { id } = req.params;
	const post = new Post(null, null, id);
	await post.delete();
	res.redirect("/admin");
}

module.exports = {
	getHome: getHome,
	getAdmin: getAdmin,
	createPost: createPost,
	getSinglePost: getSinglePost,
	updatePost: updatePost,
	deletePost: deletePost,
};
