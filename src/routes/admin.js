const express = require("express");
const adminRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const isAdmin = require("../middlewares/isAdmin");
const Complaint = require("../models/complaints");
const Admin = require("../models/admins");
const { validatePassword, ValidateEditData } = require("../helpers/validation");

// API for getting pending complaints of your department
adminRouter.get(
  "/admin/complaints/pending",
  userAuth,
  isAdmin,
  async (req, res) => {
    let department = req.user.department;
    department = department.toUpperCase();
    const complaints = await Complaint.find({
      tags: department,
      status: "pending",
    });
    if (complaints.length == 0) {
      return res.status(200).json({
        message:
          "No pending complaints currently. Check your accepted complaints panel.",
      });
    }
    res.status(200).json({
      message: "Currently pending complaints fetched.",
      data: complaints,
    });
  }
);

// API for getting accepted complaints of your department
adminRouter.get(
  "/admin/complaints/accepted",
  userAuth,
  isAdmin,
  async (req, res) => {
    let department = req.user.department;
    department = department.toUpperCase();
    const complaints = await Complaint.find({
      tags: department,
      status: "accepted",
    });
    if (complaints.length == 0) {
      return res.status(200).json({
        message:
          "No complaints accepted currently. Check your pending complaints panel.",
      });
    }
    res.status(200).json({
      message: "Currently accepted complaints fetched.",
      data: complaints,
    });
  }
);

// API for getting resolved complaints of your department
adminRouter.get(
  "/admin/complaints/resolved",
  userAuth,
  isAdmin,
  async (req, res) => {
    let department = req.user.department;
    department = department.toUpperCase();
    const complaints = await Complaint.find({
      tags: department,
      status: "resolved",
    });
    if (complaints.length == 0) {
      return res.status(200).json({
        message: "No record found!",
      });
    }
    res.status(200).json({
      message: "History of resolved complaints fetched.",
      data: complaints,
    });
  }
);

adminRouter.patch(
  "/admin/complaints/accept/:id",
  userAuth,
  isAdmin,
  async (req, res) => {
    const { _id } = req.body;

  }
);

module.exports = adminRouter;
