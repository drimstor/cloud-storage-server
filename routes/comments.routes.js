const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  getComments,
  addComment,
  deleteComment,
  updateComment,
} = require("../controllers/commentsController");

router.get("", getComments);
router.post("/add", authMiddleware, addComment);
router.delete("", authMiddleware, deleteComment);
router.put("", authMiddleware, updateComment);

module.exports = router;
