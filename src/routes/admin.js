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
    }).populate("studentId", "rollNumber");
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
    }).populate("acceptedBy", "name email").populate("studentId", "rollNumber");
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
    }).populate("acceptedBy", "name email").populate("studentId", "rollNumber");
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

// API for accepting a complaint
adminRouter.patch(
  "/admin/complaint/accept/:id",
  userAuth,
  isAdmin,
  async (req, res) => {
    const _id  = req.params.id;
    if(!_id){
        return res.status(400).json({
            message: "Complaint ID is required."
        });
    }
    const complaint = await Complaint.findOne({_id: _id, status: "pending"});
    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found.",
      });
    }
    if(!complaint.tags.includes(req.user.department.toUpperCase())) {
        return res.status(403).json({
            message: "You cannot accept this complaint as it does not belong to your department.",
        });
    }
    if (complaint.status !== "pending") {
      return res.status(400).json({
        message: "Complaint is not in pending status.",
      });
    }
    complaint.status = "accepted";
    complaint.acceptedBy = req.user._id;
    await complaint.save();
    const populatedComplaint = await Complaint.findById(_id).populate("acceptedBy", "name email").populate("studentId", "rollNumber");
    res.status(200).json({
      message: "Complaint accepted successfully.",
      data: populatedComplaint,
    });
  }
);

module.exports = adminRouter;
