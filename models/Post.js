const { Schema, model, ObjectId } = require("mongoose");

const Post = new Schema({
  user: { type: ObjectId, ref: "User" },
  date: { type: Number, default: 0 },
  text: { type: String },
  liked: [{ type: String }],
  image: { type: String },
  name: { type: String },
  avatar: { type: String },
  // likes,
});

module.exports = model("Post", Post);
