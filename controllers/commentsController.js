const Post = require("../models/Post");
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
      const user = await User.findOne({ id: req.user.id });

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
      return res.json({ message: "The comment has been created" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Comment upload error" });
    }
  }

  async deleteComment(req, res) {
    try {
      const user = await User.findOne({ id: req.user.id });
      user.posts -= 1;
      await user.save();

      const post = await Post.findOne({ id: req.query.id });
      if (post.image) {
        const path = req.filePath + "/" + post.image;
        await fs.unlink(path);
      }
      await post.remove();

      return res.json({ message: "The post has been deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Post deletion error" });
    }
  }

  async updateComment(req, res) {
    try {
      const { text, liked } = req.body;

      const post = await Post.findOne({ id: req.query.id });
      post.text = text;
      post.liked = liked;
      await post.save();

      return res.json({ message: "The post has been updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Post updated error" });
    }
  }
}

module.exports = new commentsController();
