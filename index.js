// Import packages
const express = require("express");
const home = require("./routes/home");
const mongoose = require("mongoose");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/home", home);

// connection
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
