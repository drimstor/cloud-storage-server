const Post = require("../models/Post");
const User = require("../models/User");
const Uuid = require("uuid");
const fs = require("fs-extra");
const Comment = require("../models/Comment");

class postsController {
  async getPost(req, res) {
    try {
      const { limit, sort } = req.query;
      const posts = await Post.find().limit(limit).sort({ date: sort });
      return res.json(posts);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Get posts error" });
    }
  }

  async addPost(req, res) {
    try {
      const user = await User.findOne({ id: req.user.id });

      if (!user) return res.status(404).json({ message: "User not found" });

      user.posts += 1;
      await user.save();

      const imageName = Uuid.v4() + ".jpg";
      const file = req.files?.file;

      if (file) {
        await file.mv(req.filePath + "/" + req.user.id + "/" + imageName);
      }

      const post = new Post({
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
        date: Date.now(),
        text: req.body.text,
        liked: [],
        image: file ? req.user.id + "/" + imageName : "",
      });

      await post.save();
      return res.json({ message: "The post has been created" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Post upload error" });
    }
  }

  async deletePost(req, res) {
    try {
      const user = await User.findOne({ id: req.user.id });
      user.posts -= 1;
      await user.save();

      const post = await Post.findOne({ _id: req.query.id });

      if (post?.image) {
        const path = req.filePath + "/" + post.image;
        await fs.unlink(path);
      }

      const comments = await Comment.find({ postId: post._id });

      comments.forEach(async (item) => {
        const comment = await Comment.findOne({ _id: item._id });

        if (comment?.image) {
          const path = req.filePath + "/" + comment.image;
          await fs.unlink(path);
        }
      });

      await Comment.deleteMany({ postId: post._id });

      await post.remove();
      return res.json({ message: "The post has been deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Post deletion error" });
    }
  }

  async updatePost(req, res) {
    try {
      const { text, liked } = req.body;

      const post = await Post.findOne({ _id: req.query.id });
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

module.exports = new postsController();
