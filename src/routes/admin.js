const express = require("express");
const adminRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const isAdmin = require("../middlewares/isAdmin");
const Complaint = require("../models/complaints");
const Admin = require("../models/admins");
const { validatePassword, ValidateEditData } = require("../helpers/validation");

adminRouter.get("/admin/complaints", userAuth, isAdmin, async (req, res) => {
  const department = req.user.department;
  const complaints = await Complaint.find({ department: department });
  res.status(200).json({ message: "complaints fetched.", data: complaints });
});

module.exports = adminRouter;
