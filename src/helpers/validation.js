const validator = require("validator");

const validateLoginData = (req) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    throw new Error("Email, password and role are required.");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address.");
  }else if( role !== "superAdmin" && role !== "admin" && role !== "student") {
    throw new Error("Invalid role. Must be 'superAdmin', 'admin', or 'student'.");
  }
};

const validateNewPassword = (newPassword) => {
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Please Enter a strong new password.");
  }
};

module.exports = { validateLoginData, validateNewPassword };
