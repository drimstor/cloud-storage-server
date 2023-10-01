const { Schema, model, ObjectId } = require("mongoose");

const User = new Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  name: { type: String, require: true },
  diskSpace: { type: Number, default: 1024 ** 3 * 1 },
  usedSpace: { type: Number, default: 0 },
  avatar: { type: String },
  files: [{ type: ObjectId, ref: "File" }],
  posts: { type: Number, default: 0 },
});

module.exports = model("User", User);
