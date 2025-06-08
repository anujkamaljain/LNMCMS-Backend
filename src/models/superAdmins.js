const mongoose = require("mongoose");
const validator = require("validator");

const superAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 150,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        const regex = /^[a-zA-Z0-9._%+-]+@lnmiit\.ac\.in$/;
        if (!regex.test(value)) {
          throw new Error("Please enter a valid college email address.");
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
      enum: ["superAdmin"],
      default: "superAdmin",
    },
  },
  { timestamps: true }
);

superAdminSchema.pre("save", async function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
