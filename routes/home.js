const express = require("express");
const router = express.Router();
const config = require("config");

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing",
    message: `Port ${config.get("serverPort")}`,
  });
});

module.exports = router;
