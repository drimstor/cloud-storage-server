// Import packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");
const fileUpload = require("express-fileupload");
const filePathMiddleware = require("./middleware/filePath.middleware");
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(filePathMiddleware(path.resolve(__dirname, "files")));
app.use(fileUpload({}));

// Static
app.use(express.static("files"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

// Connection
(async () => {
  try {
    mongoose.connect(
      "mongodb+srv://admin:admin@cluster.k2yyl5n.mongodb.net/?retryWrites=true&w=majority"
    );
    app.listen(PORT, () => console.log("Server started on port", PORT));
  } catch (error) {
    console.log(error);
  }
})();
