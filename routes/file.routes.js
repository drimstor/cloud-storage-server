const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createDir,
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
  searchFile,
  uploadAvatar,
  deleteAvatar,
  renameFile,
} = require("../controllers/fileController");

router.get("", authMiddleware, getFiles);
// router.get("/download", authMiddleware, downloadFile);
// router.get("/search", authMiddleware, searchFile);
router.post("", authMiddleware, createDir);
router.post("/upload", authMiddleware, uploadFile);
// router.post("/avatar", authMiddleware, uploadAvatar);
// router.post("/rename", authMiddleware, renameFile);
// router.delete("/", authMiddleware, deleteFile);
// router.delete("/avatar", authMiddleware, deleteAvatar);

module.exports = router;
