const express = require("express");
const studentRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const Student = require("../models/students");
const Complaint = require("../models/complaints");
const isStudent = require("../middlewares/isStudent");
const {validatePassword} = require("../helpers/validation");
const bcrypt = require("bcrypt");

// POST /student/complaint — Register a complaint
studentRouter.post(
  "/student/complaint",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const {
        title,
        description,
        tags,
        location,
        availableTimeFrom,
        availableTimeTo,
        contactNumber,
      } = req.body;

      // Validate required fields
      if (
        !title ||
        !description ||
        !tags ||
        !location ||
        !availableTimeFrom ||
        !availableTimeTo ||
        !contactNumber
      ) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const newComplaint = new Complaint({
        studentId: req.user._id,
        title,
        description,
        tags,
        location,
        availableTimeFrom,
        availableTimeTo,
        contactNumber,
      });

      await newComplaint.save();

      res.status(201).json({
        message: "Complaint registered successfully.",
        data: newComplaint,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET /student/complaints — Fetch all complaints of the logged-in student
studentRouter.get(
  "/student/complaints",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const studentId = req.user._id;

      const complaints = await Complaint.find({ studentId })
        .populate("acceptedBy", "name email")
        .populate("studentId", "rollNumber");

      if (complaints.length === 0) {
        return res.status(200).json({
          message: "You have not registered any complaints yet.",
        });
      }

      res.status(200).json({
        message: "Your complaints have been fetched successfully.",
        data: complaints,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

// PATCH /student/changepassword — Update student password
studentRouter.patch("/student/changepassword", userAuth, isStudent, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Old password, new password, and confirm password are required",
      });
    }

    const student = req.user;

    // Step 1: Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Step 2: Ensure new and confirm passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match",
      });
    }

    // Step 3: Check if new password is different from old password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    // Step 4: Validate new password strength
    validatePassword(newPassword); // throws error if weak

    // Step 5: Save new password
    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();

    res.status(200).json({
      message: `${student.name}, your password has been successfully updated.`,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API for resolving a complaint
studentRouter.patch(
  "/student/complaint/resolve/:id",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const _id = req.params.id;

      if (!_id) {
        return res.status(400).json({ message: "Complaint ID is required." });
      }

      // Fetch the complaint and populate necessary fields
      const complaint = await Complaint.findOne({ _id }).populate("acceptedBy", "name email");

      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found." });
      }

      // Check if complaint belongs to the logged-in student
      if (complaint.studentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to resolve this complaint." });
      }

      // Status checks
      if (complaint.status === "pending") {
        return res.status(400).json({ message: "Complaint is still pending and cannot be marked as resolved." });
      }

      if (complaint.status === "resolved") {
        return res.status(400).json({ message: "Complaint is already resolved." });
      }

      // Update the status
      complaint.status = "resolved";
      await complaint.save();

      const populatedComplaint = await Complaint.findById(_id)
        .populate("acceptedBy", "name email")
        .populate("studentId", "rollNumber");

      res.status(200).json({
        message: "Complaint marked as resolved.",
        data: populatedComplaint,
      });
    } catch (err) {
      res.status(500).json({ message: "Complaint ID is Incorrrect" });
    }
  }
);

// GET API - Monthly complaints for current year for logged-in student
studentRouter.get(
  "/student/complaints/monthly",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const studentId = req.user._id;

      // Get start and end of current year
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1); // Jan 1
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59); // Dec 31

      const results = await Complaint.aggregate([
        {
          $match: {
            studentId: studentId,
            createdAt: { $gte: startOfYear, $lte: endOfYear },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.month": 1 },
        },
      ]);

      const monthMap = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      // Initialize with 0 for all months
      const response = {};
      for (let i = 0; i < 12; i++) {
        response[monthMap[i]] = 0;
      }

      // Fill in data from aggregation
      results.forEach(({ _id, count }) => {
        const monthName = monthMap[_id.month - 1];
        response[monthName] = count;
      });

      res.json(response);
    } catch (err) {
      console.error("Student monthly complaint error:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = studentRouter;
