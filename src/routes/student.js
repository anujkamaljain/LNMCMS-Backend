const express = require("express");
const studentRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const Student = require("../models/students");
const Complaint = require("../models/complaints");
const isStudent = require("../middlewares/isStudent");
const { validatePassword } = require("../helpers/validation");
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
        visibility,
      } = req.body;

      // Validate required fields
      if (
        !title ||
        !description ||
        !tags ||
        !location ||
        !availableTimeFrom ||
        !availableTimeTo ||
        !contactNumber ||
        !visibility
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
        visibility
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

// GET /student/complaints/pending
studentRouter.get(
  "/student/complaints/pending",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const studentId = req.user._id;

      const complaints = await Complaint.find({ studentId, status: "pending" })
        .populate("acceptedBy", "name email")
        .populate("studentId", "rollNumber");

      if (complaints.length === 0) {
        return res.status(200).json({
          message: "You have no pending complaints.",
        });
      }

      res.status(200).json({
        message: "Your pending complaints have been fetched successfully.",
        data: complaints,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

// GET /student/complaints/accepted
studentRouter.get(
  "/student/complaints/accepted",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const studentId = req.user._id;

      const complaints = await Complaint.find({ studentId, status: "accepted" })
        .populate("acceptedBy", "name email")
        .populate("studentId", "rollNumber");

      if (complaints.length === 0) {
        return res.status(200).json({
          message: "You have no accepted complaints.",
        });
      }

      res.status(200).json({
        message: "Your accepted complaints have been fetched successfully.",
        data: complaints,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

// GET /student/complaints/resolved
studentRouter.get(
  "/student/complaints/resolved",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const studentId = req.user._id;

      const complaints = await Complaint.find({ studentId, status: "resolved" })
        .populate("acceptedBy", "name email")
        .populate("studentId", "rollNumber");

      if (complaints.length === 0) {
        return res.status(200).json({
          message: "You have no resolved complaints.",
        });
      }

      res.status(200).json({
        message: "Your resolved complaints have been fetched successfully.",
        data: complaints,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

// GET /student/complaints — Fetch all complaints of the logged-in student

// studentRouter.get(
//   "/student/complaints",
//   userAuth,
//   isStudent,
//   async (req, res) => {
//     try {
//       const studentId = req.user._id;

//       const complaints = await Complaint.find({ studentId })
//         .populate("acceptedBy", "name email")
//         .populate("studentId", "rollNumber");

//       if (complaints.length === 0) {
//         return res.status(200).json({
//           message: "You have not registered any complaints yet.",
//         });
//       }

//       res.status(200).json({
//         message: "Your complaints have been fetched successfully.",
//         data: complaints,
//       });
//     } catch (err) {
//       res.status(500).json({ message: "Server error: " + err.message });
//     }
//   }
// );

// PATCH /student/changepassword — Update student password
studentRouter.patch(
  "/student/changepassword",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          message:
            "Old password, new password, and confirm password are required",
        });
      }

      const student = req.user;

      const isMatch = await bcrypt.compare(oldPassword, student.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          message: "New password and confirm password do not match",
        });
      }

      if (oldPassword === newPassword) {
        return res.status(400).json({
          message: "New password cannot be the same as the old password",
        });
      }

      validatePassword(newPassword);

      student.password = await bcrypt.hash(newPassword, 10);
      await student.save();

      res.status(200).json({
        message: `${student.name}, your password has been successfully updated.`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

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

      const complaint = await Complaint.findOne({ _id }).populate(
        "acceptedBy",
        "name email"
      );

      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found." });
      }

      if (complaint.studentId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({
            message: "You are not authorized to resolve this complaint.",
          });
      }

      if (complaint.status === "pending") {
        return res
          .status(400)
          .json({
            message:
              "Complaint is still pending and cannot be marked as resolved.",
          });
      }

      if (complaint.status === "resolved") {
        return res
          .status(400)
          .json({ message: "Complaint is already resolved." });
      }

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
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
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

// GET API - Get all public pending complaints for discover page
studentRouter.get(
  "/student/complaints/public",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const complaints = await Complaint.find({ 
        visibility: "public", 
        status: "pending" 
      })
        .populate("studentId", "rollNumber name")
        .populate("upvotes", "rollNumber")
        .sort({ upvoteCount: -1, createdAt: -1 }); 

      res.status(200).json({
        message: "Public complaints fetched successfully.",
        data: complaints,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

// PATCH API - Toggle upvote for a complaint
studentRouter.patch(
  "/student/complaint/upvote/:id",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const complaintId = req.params.id;
      const studentId = req.user._id;

      if (!complaintId) {
        return res.status(400).json({ message: "Complaint ID is required." });
      }

      const complaint = await Complaint.findById(complaintId);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found." });
      }

      if (complaint.visibility !== "public") {
        return res.status(403).json({ 
          message: "You can only upvote public complaints." 
        });
      }

      const hasUpvoted = complaint.upvotes.includes(studentId);
      
      if (hasUpvoted) {
        complaint.upvotes = complaint.upvotes.filter(
          id => id.toString() !== studentId.toString()
        );
        await complaint.save();
        
        res.status(200).json({
          message: "Upvote removed successfully.",
          data: { upvoted: false, upvoteCount: complaint.upvoteCount }
        });
      } else {
        complaint.upvotes.push(studentId);
        await complaint.save();
        
        res.status(200).json({
          message: "Upvoted successfully.",
          data: { upvoted: true, upvoteCount: complaint.upvoteCount }
        });
      }
    } catch (err) {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

module.exports = studentRouter;
