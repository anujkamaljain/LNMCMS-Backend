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
      enum: ["pending", "accepted", "resolved", "rejected"],
      default: "pending",
      required: true
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      minLength: 10,
      maxLength: 200,
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
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      required: true
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
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    }],
    upvoteCount: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    media: [{
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      },
      filename: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: true
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

complaintSchema.pre("save", async function (next){
  if (this.isModified("tags")) {
  this.tags = this.tags.map(tag => tag.toUpperCase());
  }
  if(this.isModified("status")){
    this.status = this.status.toLowerCase();
  }
  if (this.isModified("upvotes")) {
    this.upvoteCount = this.upvotes.length;
  }
  next();
});

module.exports = mongoose.model("Complaint", complaintSchema);
