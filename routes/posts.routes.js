const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  addPost,
  getPost,
  deletePost,
  updatePost,
} = require("../controllers/postsController");

router.get("", getPost);
router.post("/add", authMiddleware, addPost);
router.delete("", authMiddleware, deletePost);
router.put("", authMiddleware, updatePost);

module.exports = router;
