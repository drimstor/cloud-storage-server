// Import packages
const express = require("express");
const home = require("./routes/home");
const mongoose = require("mongoose");
const cors = require("cors");

// Naming
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/home", home);

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
