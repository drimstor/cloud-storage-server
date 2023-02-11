const Router = require("express");
const router = new Router();
const registrationValidate = require("../middleware/validate.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const {
  userRegistration,
  userLogin,
  checkAuth,
} = require("../controllers/authController");

router.post("/login", userLogin);
// router.post("/registration", registrationValidate, userRegistration);
// router.get("/auth", authMiddleware, checkAuth);

module.exports = router;
