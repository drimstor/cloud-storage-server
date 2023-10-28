const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  getMessages,
  sendMessage,
  searchUsers,
  setPreviewChats,
  getPreviewChats,
  changePreviewChats,
  // deleteMessage,
  // updateMessage,
} = require("../controllers/messagesController");

router.get("", authMiddleware, getMessages);
router.post("", authMiddleware, sendMessage);
// router.delete("", authMiddleware, deleteMessage);
// router.put("", authMiddleware, updateMessage);

router.get("/users-preview-search", authMiddleware, searchUsers);
router.get("/users-preview", authMiddleware, getPreviewChats);
router.post("/users-preview", authMiddleware, setPreviewChats);
router.put("/users-preview", authMiddleware, changePreviewChats);

module.exports = router;
