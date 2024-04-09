const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: "General",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPrivate: {
      type: String,
      default: "off",
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
