const mongoose = require("mongoose");
const validator = require("validator");

const complaintSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 50,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
      maxLength: 300,
    },
    tags: {
      type: [String],
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "resolved"],
      default: "pending",
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
      validate(value) {
        if (!validator.isLength(value, { min: 3, max: 150 })) {
          throw new Error("Location must be between 3 and 150 characters.");
        }
      },
    },
    availableTimeFrom: {
      type: String,
      required: true,
    },
    availableTimeTo: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
      validate(value) {
        const regex = /^\d{10}$/;
        if (!regex.test(value)) {
          throw new Error("Contact number must be a valid 10-digit number.");
        }
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
