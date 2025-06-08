const mongoose = require("mongoose");
const validator = require("validator");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 150,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        const regex = /^[0-9]{2}[a-zA-Z]{3}[0-9]{3}$/;
        if (!(regex.test(value))) {
          throw new Error(
            "Invalid roll number please enter a valid roll number."
          );
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        const regex = /^[0-9]{2}[A-Za-z]{3}[0-9]{3}@lnmiit\.ac\.in$/;
        if (!(regex.test(value))) {
          throw new Error("Please Enter a valid LNMIIT email address.");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Your password must contain at least 8 characters, including uppercase, lowercase, numbers, and symbols."
          );
        }
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["student"],
      default: "student",
    },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function (next) {
  if(this.isModified("rollNumber")){
    this.rollNumber = this.rollNumber.toUpperCase();
  }
  if(this.isModified("email")){
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model("Student", studentSchema);
