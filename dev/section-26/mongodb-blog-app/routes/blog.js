const express = require("express");
const mongodb = require("mongodb");
const database = require("../data/database");
const db = require("../data/database");
const { ObjectId } = mongodb;

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  try {
    const posts = await db
      .getDb()
      .collection("posts")
      .find({})
      .project({ title: 1, "author.name": 1, content: 1 })
      .toArray();
    res.render("posts-list", { posts: posts });
  } catch (err) {
    return res.status(404).render("404");
  }
});

router.get("/posts/:id", async function (req, res) {
  let { id } = req.params;
  try {
    const postId = new ObjectId(id);
    const post = await db
      .getDb()
      .collection("posts")
      .findOne({ _id: postId }, { summary: 0 });
    if (post == null) {
      return res.status(404).render("404");
    }
    post.humanReadableDate = post.date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    post.date = post.date.toISOString();
    return res.render("post-detail", { post: post });
  } catch (error) {
    return res.status(404).render("404");
  }
});

router.get("/new-post", async function (req, res) {
  try {
    const authors = await db.getDb().collection("authors").find().toArray();
    res.render("create-post", { authors: authors });
  } catch (error) {
    return res.status(404).render("404");
  }
});

router.post("/posts", async function (req, res) {
  try {
    const { title, summary, content } = req.body;
    const authorId = ObjectId(req.body.author);
    const author = await db
      .getDb()
      .collection("authors")
      .findOne({ _id: authorId });
    const newPost = {
      title,
      summary,
      content,
      date: new Date(),
      author: {
        id: authorId,
        name: author.name,
      },
    };
    const result = await database
      .getDb()
      .collection("posts")
      .insertOne(newPost);
    res.redirect("/posts");
  } catch (error) {
    return res.status(404).render("404");
  }
});

router.get("/posts/:id/edit", async function (req, res) {
  try {
    const { id } = req.params;
    const post = await db
      .getDb()
      .collection("posts")
      .findOne(
        { _id: ObjectId(id) },
        { _id: 1, title: 1, summary: 1, content: 1 }
      );
    if (!post) {
      return res.status(404).render("404");
    }
    res.render("update-post", { post: post });
  } catch (error) {
    return res.status(404).render("404");
  }
});

router.post("/posts/:id/edit", async function (req, res) {
  try {
    const { title, summary, content } = req.body;
    const { id } = req.params;
    const post = await db
      .getDb()
      .collection("posts")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, summary, content } }
      );
    res.redirect("/posts");
  } catch (error) {
    return res.status(404).render("404");
  }
});

router.post("/posts/:id/delete", async function (req, res) {
  try {
    const { id } = req.params;
    await db
      .getDb()
      .collection("posts")
      .deleteOne({ _id: new ObjectId(id) });
    res.redirect("/posts");
  } catch (error) {
    return res.status(404).render("404");
  }
});

module.exports = router;
