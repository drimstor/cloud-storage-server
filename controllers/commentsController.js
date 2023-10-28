const Comment = require("../models/Comment");
const User = require("../models/User");
const Uuid = require("uuid");
const fs = require("fs-extra");

class commentsController {
  async getComments(req, res) {
    try {
      const { limit, postId } = req.query;

      const comment = await Comment.find({ postId })
        .limit(limit)
        .sort({ date: 1 });

      return res.json(comment);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Get comments error" });
    }
  }

  async addComment(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id });

      if (!user) return res.status(404).json({ message: "User not found" });

      const imageName = Uuid.v4() + ".jpg";
      const file = req.files?.file;

      if (file) {
        await file.mv(req.filePath + "/" + req.user.id + "/" + imageName);
      }

      const comment = new Comment({
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
        date: Date.now(),
        text: req.body.text,
        liked: [],
        postId: req.body.postId,
        image: file ? req.user.id + "/" + imageName : "",
      });

      await comment.save();
      return res.json({ message: "Comment created" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Comment upload error" });
    }
  }

  async deleteComment(req, res) {
    try {
      const comment = await Comment.findOne({ _id: req.query.id });

      if (comment?.image) {
        const path = req.filePath + "/" + comment.image;
        await fs.unlink(path);
      }

      await comment.remove();
      return res.json({ message: "Comment deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Comment deletion error" });
    }
  }

  async updateComment(req, res) {
    try {
      const { text, liked } = req.body;

      const comment = await Comment.findOne({ _id: req.query.id });
      comment.text = text;
      comment.liked = liked;
      await comment.save();

      return res.json({ message: "Comment updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Comment updated error" });
    }
  }
}

module.exports = new commentsController();
