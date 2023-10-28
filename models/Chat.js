const { Schema, model } = require("mongoose");

const Chat = new Schema({
  _id: { type: String },
  senderId: { type: String },
  date: { type: Number },
  lastMessage: { type: String },
  name: { type: String },
  recipientId: { type: String },
  avatar: { type: String },
});

module.exports = model("Chat", Chat);
