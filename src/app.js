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
const mediaRouter = require("./routes/media");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");
const { chatRouter } = require("./routes/chat");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://lnmcms-frontend.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200,
  })
);

app.use("/", authRouter);
app.use("/", superAdminRouter);
app.use("/", adminRouter);
app.use("/", studentRouter);
app.use("/", mediaRouter);
app.use("/", chatRouter);

app.get("/", (req, res) => {
  res.status(200).send("LNMCMS Backend is alive 🚀");
});

const server = http.createServer(app);

initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected successfully.");
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed.", err);
  });
