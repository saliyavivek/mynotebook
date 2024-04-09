const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError.js");

const maxAge = 7 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    const { email, password } = req.body;
    // const newUser = new User(req.body.user);

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      req.flash("warn", "User already exists. Please login.");
      res.redirect("/users/login");
    } else {
      const newUser = new User({ email, password });
      await newUser.save();

      const token = createToken(newUser._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

      req.flash("success", "User signed up successfully.");
      res.redirect("/notes");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  wrapAsync(async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

      req.flash("success", "User logged in successfully.");
      res.redirect("/notes");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/users/login");
    }
  })
);

// logout user
router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  req.flash("success", "User logged out successfully.");
  res.redirect("/users/login");
});

module.exports = router;
