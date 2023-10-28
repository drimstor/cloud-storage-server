const { Schema, model } = require("mongoose");

const Message = new Schema({
  senderId: { type: String, required: true },
  recipientId: { type: String, required: true },
  text: { type: String },
  image: { type: String },
  date: { type: Number, default: 0 },
});

module.exports = model("Message", Message);
