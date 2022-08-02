const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("welcome");
});

router.get("/signup", function (req, res) {
  let sessionInputData = req.session.inputData;
  if (sessionInputData == null) {
    sessionInputData = {
      hasError: false,
      email: "",
      confirmEmail: "",
      password: "",
    };
  }
  req.session.inputData = null;

  return res.render("signup", { inputData: sessionInputData });
});

router.get("/login", function (req, res) {
  let sessionInputData = req.session.inputData;
  if (sessionInputData == null) {
    sessionInputData = {
      hasError: false,
      email: "",
      password: "",
    };
  }
  req.session.inputData = null;
  res.render("login", { inputData: sessionInputData });
});

router.post("/signup", async function (req, res) {
  const { email: userEnteredEmail, password: userEnteredPassword } = req.body;
  const confirmEmail = req.body["confirm-email"];

  if (
    !userEnteredEmail ||
    !confirmEmail ||
    !userEnteredPassword ||
    userEnteredPassword.trim() < 6 ||
    userEnteredEmail !== confirmEmail ||
    !userEnteredEmail.includes("@")
  ) {
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - please check your data!",
      email: userEnteredEmail,
      confirmEmail: confirmEmail,
      password: userEnteredPassword,
    };
    req.session.save(function () {
      res.redirect("/signup");
    });
    return;
  }

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: userEnteredEmail });
  if (existingUser) {
    req.session.inputData = {
      hasError: true,
      message: "User exists already.",
      email: userEnteredEmail,
      confirmEmail: confirmEmail,
      password: userEnteredPassword,
    };
    req.session.save(function () {
      res.redirect("/signup");
    });
    return;
  }
  const hashedPassword = await bcrypt.hash(userEnteredPassword, 12);

  const user = {
    email: userEnteredEmail,
    password: hashedPassword,
  };

  await db.getDb().collection("users").insertOne(user);
  return res.redirect("/login");
});

router.post("/login", async function (req, res) {
  const { email: userEnteredEmail, password: userEnteredPassword } = req.body;

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: userEnteredEmail });
  if (existingUser == null) {
    req.session.inputData = {
      hasError: true,
      message: 'Could not log you in. Please check credentials!',
      email: userEnteredEmail,
      password: userEnteredPassword
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }

  const passwordsAreEqual = await bcrypt.compare(
    userEnteredPassword,
    existingUser.password
  );

  if (!passwordsAreEqual) {
    req.session.inputData = {
      hasError: true,
      message: 'Could not log you in. Please check credentials!',
      email: userEnteredEmail,
      password: userEnteredPassword
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }

  req.session.user = {
    id: existingUser._id,
    email: existingUser.email,
  };
  req.session.isAuthenticated = true;
  req.session.save(function () {
    res.redirect("/profile");
  });
});

router.get("/admin", async function (req, res) {
  if (!res.locals.isAuth) {
    console.log("you are not authenticated...");
    return res.status(401).render("401");
  }
  const user = await db
    .getDb()
    .collection("users")
    .findOne({ _id: req.session.user.id });
  if (!res.locals.isAdmin) {
    return res.status(403).render("403");
  }
  res.render("admin");
});

router.get("/profile", function (req, res) {
  if (!res.locals.isAuth) {
    console.log("you are not authenticated...");
    return res.status(401).render("401");
  }
  res.render("profile");
});

router.post("/logout", function (req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect("/");
});

module.exports = router;
