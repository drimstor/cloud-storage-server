const User = require("../models/User");
const Uuid = require("uuid");
// const fs = require("fs-extra");
// const Comment = require("../models/Comment");
const Message = require("../models/Message");
const Chat = require("../models/Chat");

class messageController {
  // Sidebar preview
  async searchUsers(req, res) {
    try {
      const { name } = req.query;

      const isAllUsers = name === "getAllUsers";

      const regex = new RegExp(`^${name}`, "i");

      const users = await User.find(
        isAllUsers
          ? {}
          : {
              name: regex,
            }
      ).sort(isAllUsers ? { _id: -1 } : {});

      return res.json(name ? users : []);
    } catch (error) {
      console.log(error);
      res.send({ message: "Server error" });
    }
  }

  async getPreviewChats(req, res) {
    try {
      const { id } = req.user;

      const chats = await Chat.find({ senderId: id }).sort({ date: -1 });

      return res.status(200).json(chats);
    } catch (error) {
      console.log(error);
      res.send({ message: "Server error" });
    }
  }

  async setPreviewChats(req, res) {
    try {
      const { senderId, recipientId } = req.body;

      const senderDBChat = await Chat.findOne({ _id: senderId + recipientId });

      if (senderDBChat) return;

      const sender = await User.findOne({ _id: senderId });
      const recipient = await User.findOne({ _id: recipientId });

      const senderChat = new Chat({
        _id: senderId + recipientId,
        date: Date.now(),
        senderId: senderId,
        lastMessage: "",
        name: recipient.name,
        recipientId: recipientId,
        avatar: recipient.avatar,
      });
      await senderChat.save();

      const recipientChat = new Chat({
        _id: recipientId + senderId,
        date: Date.now(),
        senderId: recipientId,
        lastMessage: "",
        name: sender.name,
        recipientId: senderId,
        avatar: sender.avatar,
      });
      await recipientChat.save();

      return res.status(200).json({ message: "Chat added" });
    } catch (error) {
      console.log(error);
      res.send({ message: "Server error" });
    }
  }

  async changePreviewChats(req, res) {
    try {
      const { senderId, recipientId, text } = req.body;

      const senderDBChat = await Chat.findOne({ _id: senderId + recipientId });

      const recipientDBChat = await Chat.findOne({
        _id: recipientId + senderId,
      });

      senderDBChat.date = Date.now();
      senderDBChat.lastMessage = text;
      await senderDBChat.save();

      recipientDBChat.date = Date.now();
      recipientDBChat.lastMessage = text;
      await recipientDBChat.save();

      return res.json({ message: "Message sent" });
    } catch (error) {
      console.log(error);
      res.send({ message: "Server error" });
    }
  }

  // Messages
  async getMessages(req, res) {
    try {
      const { senderId, recipientId } = req.query;

      const messages = await Message.find({
        $or: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
      }).sort({ date: 1 });

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages." });
    }
  }

  async sendMessage(req, res) {
    try {
      const imageName = Uuid.v4() + ".jpg";
      const file = req.files?.file;

      if (file) {
        await file.mv(req.filePath + "/" + req.user.id + "/" + imageName);
      }

      const message = new Message({
        date: Date.now(),
        text: req.body.text,
        image: file ? req.user.id + "/" + imageName : "",
        senderId: req.user.id,
        recipientId: req.body.recipientId,
      });

      await message.save();
      return res.json({ message: "Message sent" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Message upload error" });
    }
  }

  // async deleteMessage(req, res) {
  //   try {
  //     const user = await User.findOne({ _id: req.user.id });
  //     user.posts -= 1;
  //     await user.save();

  //     const post = await Message.findOne({ _id: req.query.id });

  //     if (post?.image) {
  //       const path = req.filePath + "/" + post.image;
  //       await fs.unlink(path);
  //     }

  //     const comments = await Comment.find({ postId: post._id });

  //     comments.forEach(async (item) => {
  //       const comment = await Comment.findOne({ _id: item._id });

  //       if (comment?.image) {
  //         const path = req.filePath + "/" + comment.image;
  //         await fs.unlink(path);
  //       }
  //     });

  //     await Comment.deleteMany({ postId: post._id });

  //     await post.remove();
  //     return res.json({ message: "Post deleted" });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Post deletion error" });
  //   }
  // }

  // async updateMessage(req, res) {
  //   try {
  //     const { text, liked } = req.body;

  //     const post = await Message.findOne({ _id: req.query.id });
  //     post.text = text;
  //     post.liked = liked;
  //     await post.save();

  //     return res.json({ message: "Post updated" });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Post updated error" });
  //   }
  // }
}

module.exports = new messageController();
