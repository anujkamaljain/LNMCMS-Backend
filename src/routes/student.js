const express = require("express");
const studentRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const Student = require("../models/students");
const Complaint = require("../models/complaints");
const isStudent = require("../middlewares/isStudent");

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

// GET /student/complaints — Fetch all complaints of the logged-in student
studentRouter.get("/student/complaints", userAuth, isStudent, async (req, res) => {
  try {
    const studentId = req.user._id;

    const complaints = await Complaint.find({ studentId });

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
});

module.exports = studentRouter;
