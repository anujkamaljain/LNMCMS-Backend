const express = require("express");
const connectDB = require("./config/database");
const app = express();
app.use(express.json());
require("dotenv").config();




connectDB()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed.", err);
  });
