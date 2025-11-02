const express = require("express");
const adminRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const isAdmin = require("../middlewares/isAdmin");
const Complaint = require("../models/complaints");
const { validatePassword } = require("../helpers/validation");
const bcrypt = require("bcrypt");

// API for getting pending complaints of your department
adminRouter.get(
  "/admin/complaints/pending",
  userAuth,
  isAdmin,
  async (req, res) => {
    try {
      let department = req.user.department;
      department = department.toUpperCase();
      
      // Pagination parameters
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      
      const skip = (page - 1) * limit;
      
      // Get total count for pagination
      const totalComplaints = await Complaint.countDocuments({
        tags: department,
        status: "pending",
      });
      
      const complaints = await Complaint.find({
        tags: department,
        status: "pending",
      })
        .populate("studentId", "rollNumber")
        .select("+media")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by newest first
      
      const totalPages = Math.ceil(totalComplaints / limit);
      
      if (complaints.length == 0) {
        return res.status(200).json({
          message:
            "No pending complaints currently. Check your accepted complaints panel.",
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
        message: "Currently pending complaints fetched.",
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

// API for getting accepted complaints of your department
adminRouter.get(
  "/admin/complaints/accepted",
  userAuth,
  isAdmin,
  async (req, res) => {
    try {
      let department = req.user.department;
      department = department.toUpperCase();
      
      // Pagination parameters
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      
      const skip = (page - 1) * limit;
      
      // Get total count for pagination
      const totalComplaints = await Complaint.countDocuments({
        tags: department,
        status: "accepted",
      });
      
      const complaints = await Complaint.find({
        tags: department,
        status: "accepted",
      })
        .populate("acceptedBy", "name email")
        .populate("studentId", "rollNumber")
        .select("+media")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by newest first
      
      const totalPages = Math.ceil(totalComplaints / limit);
      
      if (complaints.length == 0) {
        return res.status(200).json({
          message:
            "No complaints accepted currently. Check your pending complaints panel.",
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
        message: "Currently accepted complaints fetched.",
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

// API for getting resolved complaints of your department
adminRouter.get(
  "/admin/complaints/resolved",
  userAuth,
  isAdmin,
  async (req, res) => {
    try {
      let department = req.user.department;
      department = department.toUpperCase();
      
      // Pagination parameters
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      
      const skip = (page - 1) * limit;
      
      // Get total count for pagination
      const totalComplaints = await Complaint.countDocuments({
        tags: department,
        status: "resolved",
      });
      
      const complaints = await Complaint.find({
        tags: department,
        status: "resolved",
      })
        .populate("acceptedBy", "name email")
        .populate("studentId", "rollNumber")
        .select("+media")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by newest first
      
      const totalPages = Math.ceil(totalComplaints / limit);
      
      if (complaints.length == 0) {
        return res.status(200).json({
          message: "No record found!",
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
        message: "History of resolved complaints fetched.",
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

// API for accepting a complaint
adminRouter.patch(
  "/admin/complaint/accept/:id",
  userAuth,
  isAdmin,
  async (req, res) => {
    const _id = req.params.id;
    if (!_id) {
      return res.status(400).json({
        message: "Complaint ID is required.",
      });
    }
    const complaint = await Complaint.findOne({ _id: _id }).populate(
      "acceptedBy",
      "name email"
    );
    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found.",
      });
    }
    if (!complaint.tags.includes(req.user.department.toUpperCase())) {
      return res.status(403).json({
        message:
          "You cannot accept this complaint as it does not belong to your department.",
      });
    }
    if (complaint.status === "accepted") {
      return res.status(400).json({
        message: `Complaint is already accepted by ${complaint.acceptedBy.name}.`,
      });
    }
    if (complaint.status === "resolved") {
      return res.status(400).json({
        message: `Complaint is already resolved by ${complaint.acceptedBy.name}.`,
      });
    }
    complaint.status = "accepted";
    complaint.acceptedBy = req.user._id;
    await complaint.save();
    const populatedComplaint = await Complaint.findById(_id)
      .populate("acceptedBy", "name email")
      .populate("studentId", "rollNumber")
      .select("+media");
    res.status(200).json({
      message: "Complaint accepted successfully.",
      data: populatedComplaint,
    });
  }
);

// API for rejecting a complaint
adminRouter.patch(
  "/admin/complaint/reject/:id",
  userAuth,
  isAdmin,
  async (req, res) => {
    try {
      const _id = req.params.id;
      const { rejectionReason } = req.body;

      if (!_id) {
        return res.status(400).json({
          message: "Complaint ID is required.",
        });
      }

      if (!rejectionReason || typeof rejectionReason !== "string") {
        return res.status(400).json({
          message: "Rejection reason is required.",
        });
      }

      if (rejectionReason.trim().length < 10 || rejectionReason.trim().length > 200) {
        return res.status(400).json({
          message: "Rejection reason must be between 10 and 200 characters.",
        });
      }

      const complaint = await Complaint.findOne({ _id: _id });

      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found.",
        });
      }

      if (!complaint.tags.includes(req.user.department.toUpperCase())) {
        return res.status(403).json({
          message:
            "You cannot reject this complaint as it does not belong to your department.",
        });
      }

      if (complaint.status === "accepted") {
        return res.status(400).json({
          message: "Cannot reject a complaint that has already been accepted.",
        });
      }

      if (complaint.status === "resolved") {
        return res.status(400).json({
          message: "Cannot reject a complaint that has already been resolved.",
        });
      }

      if (complaint.status === "rejected") {
        return res.status(400).json({
          message: "Complaint is already rejected.",
        });
      }

      complaint.status = "rejected";
      complaint.rejectedBy = req.user._id;
      complaint.rejectionReason = rejectionReason.trim();
      await complaint.save();

      const populatedComplaint = await Complaint.findById(_id)
        .populate("rejectedBy", "name email")
        .populate("studentId", "rollNumber")
        .select("+media");

      res.status(200).json({
        message: "Complaint rejected successfully.",
        data: populatedComplaint,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

// PATCH API to update admin password
adminRouter.patch(
  "/admin/changepassword",
  userAuth,
  isAdmin,
  async (req, res) => {
    try {
      const { confirmPassword, oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          message:
            "Old password , confirm password and new password are required",
        });
      }
      if (confirmPassword !== newPassword) {
        return res.status(400).json({
          message: "New password and confirm password do not match",
        });
      }
      if (oldPassword === newPassword) {
        return res.status(400).json({
          message: "New password cannot be the same as old password",
        });
      }
      validatePassword(newPassword);
      const admin = req.user;
      const isMatch = await bcrypt.compare(oldPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      admin.password = await bcrypt.hash(newPassword, 10);
      await admin.save();
      res.json({
        message: `${admin.name} your password is updated succesfully.`,
        data: admin,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

adminRouter.get(
  "/admin/complaints/last-30-days",
  userAuth,
  async (req, res) => {
    try {
      const { department } = req.user;

      const now = new Date();

      // ✅ Set correct UTC date range
      const endDate = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );

      const startDate = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - 29,
          0,
          0,
          0,
          0
        )
      );

      const complaints = await Complaint.aggregate([
        {
          $match: {
            tags: { $in: [department] },
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Initialize 30-day structure
      const formattedData = {};
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setUTCDate(date.getUTCDate() + i);
        const dateStr = date.toISOString().split("T")[0];
        formattedData[dateStr] = 0;
      }

      // Fill in complaint counts
      complaints.forEach((item) => {
        formattedData[item._id] = item.count;
      });

      return res
        .status(200)
        .json({ message: "data fetched!", data: formattedData });
    } catch (error) {
      console.error("Error fetching complaints:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

adminRouter.get(
  "/admin/complaints/status-complaints-30-days",
  userAuth,
  isAdmin,
  async (req, res) => {
    try {
      const { department } = req.user;

      const now = new Date();

      const endDate = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );

      const startDate = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - 29,
          0,
          0,
          0,
          0
        )
      );

      const result = await Complaint.aggregate([
        {
          $match: {
            tags: { $in: [department] },
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const summary = {
        pending: 0,
        accepted: 0,
        resolved: 0,
      };

      result.forEach((item) => {
        summary[item._id] = item.count;
      });

      return res.status(200).json({
        message: "Status summary fetched successfully",
        data: summary,
      });
    } catch (error) {
      console.error("Error fetching complaint status summary:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = adminRouter;
