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
    let user;
    let token;
    if (role === "student") {
      user = await Student.findOne({ email: email });
      token = await validateUserAndGenerateToken(user, password);
    } else if (role === "superAdmin") {
      user = await SuperAdmin.findOne({ email: email });
      token = await validateUserAndGenerateToken(user, password);
    } else if (role === "admin") {
      user = await Admin.findOne({ email: email });
      token = await validateUserAndGenerateToken(user, password);
    }
    if (!token) {
      throw new Error("Invalid credentials. Please try again.");
    }
    if (!user) {
      throw new Error("User not found. Please check your credentials.");
    }
    if (token && user) {
      if (user.role !== role) {
        throw new Error("Role mismatch. Please check your credentials.");
      }
    }
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1000 * 60 * 60 * 8, //8 hours
      path: "/",
    });
    
    res.status(200).json({ 
      message: "Login successful", 
      data: user,
      token: token 
    });
  } catch (err) {
    res.status(400).json({ message: "ERROR :" + err.message });
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

module.exports = authRouter;
