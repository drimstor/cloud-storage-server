const { Schema, model, ObjectId } = require("mongoose");

const Comment = new Schema({
  user: { type: ObjectId, ref: "User" },
  postId: { type: String },
  date: { type: Number, default: 0 },
  text: { type: String },
  liked: [{ type: String }],
  image: { type: String },
  name: { type: String },
  avatar: { type: String },
});

module.exports = model("Comment", Comment);
