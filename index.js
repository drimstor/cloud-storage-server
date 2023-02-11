// Import packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const config = require("config");
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");
const fileUpload = require("express-fileupload");
const filePathMiddleware = require("./middleware/filePath.middleware");
const dbUrl = config.get("dbUrl");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(filePathMiddleware(path.resolve(__dirname, "files")));
app.use(fileUpload({}));

// Static
app.use(express.static("static"));
app.use(express.static("files"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

// Connection
const PORT = process.env.PORT || config.get("serverPort");
(async () => {
  try {
    mongoose.connect(dbUrl);
    app.listen(PORT, () => console.log("Server started on port", PORT));
  } catch (error) {
    console.log(error);
  }
})();
