const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");
const postsRouter = require("./routes/posts.routes");
const commentsRouter = require("./routes/comments.routes");
const messagesRouter = require("./routes/messages.router");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const filePathMiddleware = require("./middleware/filePath.middleware");
const http = require("http");
const webSocketController = require("./controllers/webSocketController");
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
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/messages", messagesRouter);

// WebSocket Setup
const server = http.createServer(app); // Create an HTTP server
webSocketController(server);

// Start the server
server.listen(PORT, () => {
  console.log("Express server is listening on port", PORT);
});

// Connection to MongoDB
(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin@cluster.k2yyl5n.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();
