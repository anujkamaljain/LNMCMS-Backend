const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
require("dotenv").config();
const authRouter = require("./routes/auth");
const superAdminRouter = require("./routes/superAdmin");
const adminRouter = require("./routes/admin");
const studentRouter = require("./routes/student");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", superAdminRouter);
app.use("/", adminRouter);
app.use("/", studentRouter);

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
