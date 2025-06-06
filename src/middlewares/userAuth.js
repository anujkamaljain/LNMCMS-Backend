const jwt = require("jsonwebtoken");
const Student = require("../models/students");
const Admin = require("../models/admins");
const SuperAdmin = require("../models/superAdmins");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Please Login" });
    }
    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id, role } = decodedMessage;
    let user;
    if (role === "student") {
      user = await Student.findById(_id);
    } else if (role === "admin") {
      user = await Admin.findById(_id);
    } else if (role === "superAdmin") {
      user = await SuperAdmin.findById(_id);
    }

    if (!user) {
      throw new Error("User not found.");
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = userAuth;
