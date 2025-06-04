const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        if (!/^[0-9]{2}[a-zA-Z]{3}[0-9]{3}$/.test(value)) {
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
        if (!/^.+@lnmiit\.ac\.in$/.test(value)) {
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

studentSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

studentSchema.methods.validatePassword = async function(passwordEnteredByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordEnteredByUser, passwordHash);
    return isPasswordValid;
}

module.exports = mongoose.model("Student", studentSchema);
