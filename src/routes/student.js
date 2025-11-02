const express = require("express");
const studentRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const Student = require("../models/students");
const Complaint = require("../models/complaints");
const { Chat } = require("../models/chat");
const isStudent = require("../middlewares/isStudent");
const { validatePassword } = require("../helpers/validation");
const bcrypt = require("bcrypt");
const { uploadMultiple, handleUploadError, addFormattedFiles } = require("../middlewares/fileUpload");
const { deleteFromCloudinary } = require("../config/cloudinary");

// POST /student/complaint — Register a complaint with optional media
studentRouter.post(
  "/student/complaint",
  userAuth,
  isStudent,
  uploadMultiple('media', 3),
  addFormattedFiles,
  handleUploadError,
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
        visibility,
        media: req.formattedFiles || req.body.media || [] // Include uploaded media files or media from request body
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

      // Pagination parameters
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      
      const skip = (page - 1) * limit;
      
      // Get total count for pagination
      const totalComplaints = await Complaint.countDocuments({ 
        studentId, 
        status: "pending" 
      });

      const complaints = await Complaint.find({ studentId, status: "pending" })
        .populate("acceptedBy", "name email")
        .populate("studentId", "rollNumber")
        .select("+media")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by newest first

      const totalPages = Math.ceil(totalComplaints / limit);

      if (complaints.length === 0) {
        return res.status(200).json({
          message: "You have no pending complaints.",
          data: [],
          pagination: {
            currentPage: page,
            totalPages,
            totalComplaints,
            limit
          }
        });
      }

      res.status(200).json({
        message: "Your pending complaints have been fetched successfully.",
        data: complaints,
        pagination: {
          currentPage: page,
          totalPages,
          totalComplaints,
          limit
        }
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

      // Pagination parameters
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      
      const skip = (page - 1) * limit;
      
      // Get total count for pagination
      const totalComplaints = await Complaint.countDocuments({ 
        studentId, 
        status: "accepted" 
      });

      const complaints = await Complaint.find({ studentId, status: "accepted" })
        .populate("acceptedBy", "name email")
        .populate("studentId", "rollNumber")
        .select("+media")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by newest first

      const totalPages = Math.ceil(totalComplaints / limit);

      if (complaints.length === 0) {
        return res.status(200).json({
          message: "You have no accepted complaints.",
          data: [],
          pagination: {
            currentPage: page,
            totalPages,
            totalComplaints,
            limit
          }
        });
      }

      res.status(200).json({
        message: "Your accepted complaints have been fetched successfully.",
        data: complaints,
        pagination: {
          currentPage: page,
          totalPages,
          totalComplaints,
          limit
        }
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

      // Pagination parameters
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      
      const skip = (page - 1) * limit;
      
      // Get total count for pagination
      const totalComplaints = await Complaint.countDocuments({ 
        studentId, 
        status: "resolved" 
      });

      const complaints = await Complaint.find({ studentId, status: "resolved" })
        .populate("acceptedBy", "name email")
        .populate("studentId", "rollNumber")
        .select("+media")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by newest first

      const totalPages = Math.ceil(totalComplaints / limit);

      if (complaints.length === 0) {
        return res.status(200).json({
          message: "You have no resolved complaints.",
          data: [],
          pagination: {
            currentPage: page,
            totalPages,
            totalComplaints,
            limit
          }
        });
      }

      res.status(200).json({
        message: "Your resolved complaints have been fetched successfully.",
        data: complaints,
        pagination: {
          currentPage: page,
          totalPages,
          totalComplaints,
          limit
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

// GET /student/complaints/rejected
studentRouter.get(
  "/student/complaints/rejected",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const studentId = req.user._id;

      // Pagination parameters
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      
      const skip = (page - 1) * limit;
      
      // Get total count for pagination
      const totalComplaints = await Complaint.countDocuments({ 
        studentId, 
        status: "rejected" 
      });

      const complaints = await Complaint.find({ studentId, status: "rejected" })
        .populate("rejectedBy", "name email")
        .populate("studentId", "rollNumber")
        .select("+media")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by newest first

      const totalPages = Math.ceil(totalComplaints / limit);

      if (complaints.length === 0) {
        return res.status(200).json({
          message: "You have no rejected complaints.",
          data: [],
          pagination: {
            currentPage: page,
            totalPages,
            totalComplaints,
            limit
          }
        });
      }

      res.status(200).json({
        message: "Your rejected complaints have been fetched successfully.",
        data: complaints,
        pagination: {
          currentPage: page,
          totalPages,
          totalComplaints,
          limit
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

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
      const { rating } = req.body;

      if (!_id) {
        return res.status(400).json({ message: "Complaint ID is required." });
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating is required and must be between 1 and 5." });
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
      complaint.rating = rating;
      await complaint.save();

      // Delete chat related to this complaint
      await Chat.deleteMany({ complaintId: _id });

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

// DELETE /student/complaint/:id - Delete a pending complaint
studentRouter.delete(
  "/student/complaint/:id",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const _id = req.params.id;

      if (!_id) {
        return res.status(400).json({ message: "Complaint ID is required." });
      }

      const complaint = await Complaint.findById(_id);

      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found." });
      }

      // Check if complaint belongs to the student
      if (complaint.studentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "You are not authorized to delete this complaint.",
        });
      }

      // Only allow deletion of pending or rejected complaints
      if (complaint.status !== "pending" && complaint.status !== "rejected") {
        return res.status(400).json({
          message: "Only pending or rejected complaints can be deleted.",
        });
      }

      // Delete associated media files from Cloudinary
      if (complaint.media && complaint.media.length > 0) {
        try {
          for (const mediaFile of complaint.media) {
            if (mediaFile.publicId) {
              // publicId is stored without folder prefix in database
              // Add folder prefix for deletion in Cloudinary
              const fullPublicId = `lnmcms-complaints/${mediaFile.publicId}`;
              try {
                await deleteFromCloudinary(fullPublicId);
              } catch (deleteError) {
                // Continue deleting other files even if one fails
                console.error(`Error deleting media file ${mediaFile.publicId}:`, deleteError);
              }
            }
          }
        } catch (mediaError) {
          // Log error but continue with complaint deletion
          console.error("Error deleting media files:", mediaError);
          // Continue with complaint deletion even if media deletion fails
        }
      }

      // Delete associated chat messages
      try {
        await Chat.deleteMany({ complaintId: _id });
      } catch (chatError) {
        // Log error but continue with complaint deletion
        console.error("Error deleting chat messages:", chatError);
      }

      // Delete the complaint
      await Complaint.findByIdAndDelete(_id);

      res.status(200).json({
        message: "Complaint deleted successfully.",
      });
    } catch (err) {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

// GET API - Monthly complaints for last 12 months for logged-in student
studentRouter.get(
  "/student/complaints/monthly",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const studentId = req.user._id;

      // Calculate last 12 months dynamically
      const now = new Date();
      const currentMonth = now.getMonth(); // 0-11 (Jan = 0, Dec = 11)
      const currentYear = now.getFullYear();

      // Calculate start date (12 months ago)
      let startMonth = currentMonth - 11;
      let startYear = currentYear;
      if (startMonth < 0) {
        startMonth += 12;
        startYear -= 1;
      }

      const startDate = new Date(startYear, startMonth, 1, 0, 0, 0, 0);
      // Get last day of current month (using day 0 of next month)
      const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

      const results = await Complaint.aggregate([
        {
          $match: {
            studentId: studentId,
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
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

      // Generate last 12 months labels in order with year tracking
      const monthLabels = [];
      const monthYearMap = new Map(); // Map to track year+month combinations
      
      for (let i = 11; i >= 0; i--) {
        let monthIndex = currentMonth - i;
        let year = currentYear;
        if (monthIndex < 0) {
          monthIndex += 12;
          year -= 1;
        }
        const monthName = monthMap[monthIndex];
        // Format year as 2-digit (e.g., 24, 25)
        const yearShort = year.toString().slice(-2);
        const monthLabel = `${monthName} ${yearShort}`;
        monthLabels.push(monthLabel);
        // Store year-month key for proper mapping
        monthYearMap.set(`${year}-${monthIndex}`, monthLabel);
      }

      // Initialize response with zeros for all months
      const response = {};
      monthLabels.forEach((month) => {
        response[month] = 0;
      });

      // Fill in data from aggregation, matching by year and month
      results.forEach(({ _id, count }) => {
        const year = _id.year;
        const monthNum = _id.month - 1; // Convert to 0-based index
        const key = `${year}-${monthNum}`;
        if (monthYearMap.has(key)) {
          const monthLabel = monthYearMap.get(key);
          response[monthLabel] = count;
        }
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
      // Pagination parameters
      let { page = 1, limit = 12 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      
      const skip = (page - 1) * limit;
      
      // Get total count for pagination
      const totalComplaints = await Complaint.countDocuments({ 
        visibility: "public", 
        status: "pending" 
      });

      const complaints = await Complaint.find({ 
        visibility: "public", 
        status: "pending" 
      })
        .populate("studentId", "rollNumber name")
        .populate("upvotes", "rollNumber")
        .sort({ upvoteCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(totalComplaints / limit);

      if (complaints.length === 0) {
        return res.status(200).json({
          message: "No public complaints found.",
          data: [],
          pagination: {
            currentPage: page,
            totalPages,
            totalComplaints,
            limit
          }
        });
      }

      res.status(200).json({
        message: "Public complaints fetched successfully.",
        data: complaints,
        pagination: {
          currentPage: page,
          totalPages,
          totalComplaints,
          limit
        }
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
