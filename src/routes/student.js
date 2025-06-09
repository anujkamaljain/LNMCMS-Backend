const express = require("express");
const studentRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const Complaint = require("mongoose").models.Complaint || require("../models/Complaints");
const Student = require("../models/students");

// POST /student/complaint — Register a complaint
studentRouter.post("/student/complaint", userAuth, async (req, res) => {
  try {
    // Ensure the user is a student
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can register complaints." });
    }

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
      !title || !description || !tags || !location ||
      !availableTimeFrom || !availableTimeTo || !contactNumber
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
});

module.exports = studentRouter;
