const validator = require("validator");

const validateLoginData = (req) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    throw new Error("Email, password and role are required.");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address.");
  } else if (role !== "superAdmin" && role !== "admin" && role !== "student") {
    throw new Error(
      "Invalid role. Must be 'superAdmin', 'admin', or 'student'."
    );
  }
};

const validatePassword = (Password) => {
  if (!validator.isStrongPassword(Password)) {
    throw new Error("Please Enter a strong new password.");
  }
};

const ValidateEditData = (req) => {
  if (req.body.email && !validator.isEmail(req.body.email)) {
    throw new Error("Invalid email address.");
  }
};

module.exports = {
  validateLoginData,
  validatePassword,
  ValidateEditData,
};
