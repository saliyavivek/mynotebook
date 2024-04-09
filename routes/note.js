const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Note = require("../models/note.js");
const ExpressError = require("../utils/ExpressError.js");

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const notes = await Note.find({}).populate("owner");
    res.render("notes/index.ejs", { notes });
  })
);

router.get(
  "/private",
  wrapAsync(async (req, res) => {
    const notes = await Note.find({}).populate("owner");
    res.render("notes/private.ejs", { notes });
  })
);

router.get("/new", (req, res) => {
  res.render("notes/new.ejs");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const note = await Note.findById(id).populate("owner");
    if (!note) {
      req.flash("error", "Note does not exist!");
      res.redirect("/notes");
    }
    res.render("notes/show.ejs", { note });
  })
);

router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    if (!req.body.note) {
      throw new ExpressError(400, "Send valid data for your note.");
    }
    const newNote = new Note(req.body.note);
    if (!newNote.title) {
      throw new ExpressError(400, "Title is required!");
    }
    if (!newNote.description) {
      throw new ExpressError(400, "Description is required!");
    }
    if (newNote.tag == "") {
      newNote.tag = "General";
    }
    // console.log(res.locals.user);
    newNote.owner = res.locals.user._id;
    await newNote.save();
    req.flash("success", "Your note has been created.");
    res.redirect("/notes");
  })
);

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const note = await Note.findById(id);
    if (!note) {
      req.flash("error", "Note does not exist!");
      res.redirect("/notes");
    }
    res.render("notes/edit.ejs", { note });
  })
);

router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.note) {
      throw new ExpressError(400, "Send valid data for your note.");
    }
    let { id } = req.params;
    if (!req.body.note.isPrivate) {
      req.body.note.isPrivate = "off";
    }
    await Note.findByIdAndUpdate(id, { ...req.body.note });
    // console.log(req.body.note);
    req.flash("success", "Your note has been updated.");
    res.redirect(`/notes/${id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let note = await Note.findByIdAndDelete(id);
    console.log(note);
    req.flash("success", "Your note has been deleted.");
    res.redirect("/notes");
  })
);

module.exports = router;
