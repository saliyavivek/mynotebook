require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware.js");

const notes = require("./routes/note.js");
const users = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/mynotebook-copy";
const dbURL = process.env.ATLAS_URL;

main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.warn = req.flash("warn");
  next();
});

app.get("/", (req, res) => {
  res.redirect("/notes");
});

app.use("/notes", checkUser, requireAuth, notes);
app.use("/users", checkUser, users);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!!!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server listening to port 8080");
});
