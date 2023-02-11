// Import packages
const express = require("express");
const home = require("./routes/home");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRouter = require("./routes/auth.routes");

// Naming
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Static
app.use(express.static("static"));
app.use(express.static("files"));

// Routes
app.use("/home", home);
app.use("/api/auth", authRouter);
// app.use("/api/files", fileRouter);

// Connection
const PORT = process.env.PORT || 5000;
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
