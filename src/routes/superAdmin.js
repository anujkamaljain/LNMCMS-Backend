const express = require("express");
const superAdminRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const isSuperAdmin = require("../middlewares/isSuperAdmin");
const Student = require("../models/students");
const Admin = require("../models/admins");
const SuperAdmin = require("../models/superAdmins");
const bcrypt = require("bcrypt");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const generatePassword = require("../utils/generatePassword");
const sendMail = require("../utils/sendMail");
const { validatePassword } = require("../helpers/validation");

// API for creating a super admin
superAdminRouter.post(
  "/superadmin/superadmins",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, Email and Password are required" });
      }
      const existingSuperAdmin = await SuperAdmin.findOne({ email });
      if (existingSuperAdmin) {
        return res.status(400).json({ message: "Super Admin already exists" });
      }
      validatePassword(password);
      const passwordHash = await bcrypt.hash(password, 10);
      const newSuperAdmin = new SuperAdmin({
        name: name,
        email: email,
        password: passwordHash,
        role: "superAdmin",
      });
      await newSuperAdmin.save();

      res.status(201).json({
        message: "Super Admin created successfully",
        data: newSuperAdmin,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// API for creating a single admin
superAdminRouter.post(
  "/superadmin/admins",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      const { name, email, password, department } = req.body;
      if (!name || !email || !password || !department) {
        return res.status(400).json({
          message: "Name, Email, Password and Department are required",
        });
      }
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }
      validatePassword(password);
      const passwordHash = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        name: name,
        email: email,
        password: passwordHash,
        department: department,
        role: "admin",
      });
      await newAdmin.save();
      res.status(201).json({
        message: "Admin created successfully",
        data: newAdmin,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// API for creating a single student
superAdminRouter.post(
  "/superadmin/student",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      const { name, email, rollNumber, password } = req.body;
      if (!name || !email || !password || !rollNumber) {
        return res.status(400).json({
          message: "Name, Email, Password and rollNumber are required",
        });
      }
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: "Student already exists" });
      }
      validatePassword(password);
      const passwordHash = await bcrypt.hash(password, 10);
      const newStudent = new Student({
        name: name,
        email: email,
        password: passwordHash,
        rollNumber: rollNumber,
        role: "student",
      });
      await newStudent.save();
      res.status(201).json({
        message: "Student created successfully",
        data: newStudent,
      });
      await sendMail({
        to: email,
        subject: "Welcome to Complaint Portal",
        text: `Your student account is created.\nEmail: ${email}\nPassword: ${password}. \nPlease change your password after logging in.`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//temporary storing uploaded file
const upload = multer({ dest: "uploads/" });
//API for bulk uploading students from a CSV file
superAdminRouter.post(
  "/superadmin/students",
  userAuth,
  isSuperAdmin,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const results = [];
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          const operations = [];

          for (const row of results) {
            const { name, email, rollNumber } = row;
            if (!name?.trim() || !email?.trim() || !rollNumber?.trim())
              continue;

            const existingUser = await Student.findOne({ email });
            if (existingUser) continue;

            const randpassword = generatePassword();
            const passwordHash = await bcrypt.hash(randpassword, 10);

            const student = new Student({
              name,
              email,
              rollNumber,
              password: passwordHash,
              role: "student",
            });

            // Save student and send email in background
            const op = student
              .save()
              .then(() =>
                sendMail({
                  to: email,
                  subject: "Welcome to Complaint Portal",
                  text: `Your student account is created.\nEmail: ${email}\nPassword: ${randpassword}. \nPlease change your password after logging in.`,
                }).catch((err) => {
                  console.error("Email error:", email, err.message);
                })
              )
              .catch((err) => {
                console.error("DB Save error:", email, err.message);
              });

            operations.push(op);
          }

          Promise.allSettled(operations).then(() => {
            console.log("All operations settled (DB + Email)");
          });

          fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });

          res.status(201).json({
            message: "Students are being registered and emails are being sent.",
          });
        });
    } catch (err) {
      console.error("Unexpected Error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = superAdminRouter;
