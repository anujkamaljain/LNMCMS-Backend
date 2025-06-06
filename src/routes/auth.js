const express = require("express");
const authRouter = express.Router();
const { validateLoginData } = require("../helpers/validation");
const Student = require("../models/students");
const SuperAdmin = require("../models/superAdmins");
const Admin = require("../models/admins");
const validateUserAndGenerateToken = require("../helpers/validateUserAndGenerateToken");
const userAuth = require("../middlewares/userAuth");

authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    const { email, password, role } = req.body;
    if (role === "student") {
      const user = await Student.findOne({ email: email });
      const token = await validateUserAndGenerateToken(user, password, role);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 8,
      });
      res.status(200).json({ message: "Login successful", data: user });
    } else if (role === "superAdmin") {
      const user = await SuperAdmin.findOne({ email: email });
      const token = await validateUserAndGenerateToken(user, password, role);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 8,
      });
      res.status(200).json({ message: "Login successful", data: user });
    } else if (role === "admin") {
      const user = await Admin.findOne({ email: email });
      const token = await validateUserAndGenerateToken(user, password, role);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 8, //8 hours
      });
      res.status(200).json({ message: "Login successful", data: user });
    }
  } catch (err) {
    res.status(400).json({ message: "ERROR :" + err.message });
  }
});

authRouter.post("/logout",userAuth , async (req, res) => {
  console.log(req.user);
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

module.exports = authRouter;
