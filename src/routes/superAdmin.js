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
const { validatePassword, ValidateEditData } = require("../helpers/validation");
const Complaint = require("../models/complaints");

// POST API for creating a single super admin
superAdminRouter.post(
  "/superadmin/superadmin",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      let { name, email, password } = req.body;
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
      await sendMail({
        to: email,
        subject: "Welcome to Complaint Portal",
        text: `Your Super Admin account is created.\n\n Your Login credentials are as follows: \n\nEmail: ${email}\nPassword: ${password}. \n\nPlease change your password after logging in.`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// POST API for creating a single admin
superAdminRouter.post(
  "/superadmin/admin",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      let { name, email, password, department } = req.body;
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
      await sendMail({
        to: email,
        subject: "Welcome to Complaint Portal",
        text: `Your admin account is created.\n\n Your Login credentials are as follows: \n\nEmail: ${email}\nPassword: ${password}. \n\nPlease change your password after logging in.`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// POST API for creating a single student
superAdminRouter.post(
  "/superadmin/student",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      let { name, email, rollNumber, password } = req.body;
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
        text: `Your student account is created.\n\n Your Login credentials are as follows: \n\nEmail: ${email}\nPassword: ${password}. \n\nPlease change your password after logging in.`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE API to delete your own super admin account
superAdminRouter.delete(
  "/superadmin/superadmin",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      let { email } = req.user;
      if (!email) {
        return res
          .status(400)
          .json({ message: "Email is required. Please Loin" });
      }
      const superAdminCount = await SuperAdmin.countDocuments();
      if (superAdminCount == 1) {
        return res
          .status(500)
          .json({
            message:
              "You are the last Super Admin. Cannot delete your account!",
          });
      }
      const deletedCount = await SuperAdmin.deleteOne({ email: email });
      if (deletedCount === 0) {
        return res.status(404).json({ message: "Unable to delete account." });
      }
      res.clearCookie("token");
      res.status(200).json({
        message: "Your account deleted successfully.",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE API to delete admin by email (email passed as URL param)
superAdminRouter.delete(
  "/superadmin/admin/:email",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      let email = req.params.email;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const deletedAdmin = await Admin.findOneAndDelete({ email });

      if (!deletedAdmin) {
        return res
          .status(404)
          .json({ message: "Admin not found with that email" });
      }

      res.status(200).json({
        message: "Admin deleted successfully",
        data: deletedAdmin,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// DELETE API to delete Student by Roll Number
superAdminRouter.delete(
  "/superadmin/student/:rollNumber",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      let { rollNumber } = req.params;

      if (!rollNumber) {
        return res.status(400).json({ message: "Roll number is required" });
      }

      rollNumber = rollNumber.toUpperCase();

      const user = await Student.findOne({ rollNumber });

      if (!user) {
        return res.status(404).json({ message: "Student not found" });
      }

      const deletedComplaints = await Complaint.deleteMany({
        studentId: user._id,
      });

      const deletedStudent = await Student.deleteOne({ rollNumber });

      if (!deletedStudent.deletedCount === 0) {
        return res.status(404).json({ message: "Student not deleted" });
      }

      res.status(200).json({
        message: "Student deleted successfully",
        data: user,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET API to fetch student by Roll Number
superAdminRouter.get(
  "/superadmin/student/:rollNumber",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      let { rollNumber } = req.params;
      if (!rollNumber) {
        return res.status(400).json({ message: "Roll number is required" });
      }
      rollNumber = rollNumber.toUpperCase();
      const student = await Student.findOne({ rollNumber: rollNumber });
      if (!student) {
        return res.status(404).json({
          message: `Student not found with roll number ${rollNumber}`,
        });
      }
      res.status(200).json({
        message: "Student found",
        data: student,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET API to fetch students for PAGINATION
superAdminRouter.get(
  "/superadmin/students",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      let { page = 1, limit = 20 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      const skip = (page - 1) * limit;

      const students = await Student.find()
        .sort({ rollNumber: 1 }) // optional: sort alphabetically
        .skip(skip)
        .limit(limit);

      const totalStudents = await Student.countDocuments();
      const totalPages = Math.ceil(totalStudents / limit);

      res.status(200).json({
        students,
        totalPages,
        currentPage: page,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET API to fetch admins for PAGINATION
superAdminRouter.get(
  "/superadmin/admins",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      let { page = 1, limit = 16 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      const skip = (page - 1) * limit;

      const admins = await Admin.find()
        .sort({ email: 1 }) // optional: sort alphabetically
        .skip(skip)
        .limit(limit);

      const totalAdmins = await Admin.countDocuments();
      const totalPages = Math.ceil(totalAdmins / limit);

      res.status(200).json({
        admins,
        totalPages,
        currentPage: page,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET API to fetch admin by email
superAdminRouter.get(
  "/superadmin/admin/:email",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      let { email } = req.params;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      email = email.toLowerCase();
      const admin = await Admin.findOne({ email: email });
      if (!admin) {
        return res
          .status(404)
          .json({ message: `Admin not found with email ${email}` });
      }
      res.status(200).json({
        message: "Admin found",
        data: admin,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// PATCH API to update super admin own details
superAdminRouter.patch(
  "/superadmin/superadmin",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      ValidateEditData(req);
      const superAdmin = req.user;
      Object.keys(req.body).forEach((key) => {
        superAdmin[key] = req.body[key];
      });
      await superAdmin.save();
      res.status(200).json({
        message: "Super Admin details updated successfully",
        data: superAdmin,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// PATCH API to update super admin password
superAdminRouter.patch(
  "/superadmin/changepassword",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      const { confirmPassword, oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          message:
            "Old password , confirm password and new password are required",
        });
      }
      if (confirmPassword !== newPassword) {
        return res.status(400).json({
          message: "New password and confirm password do not match",
        });
      }
      if (oldPassword === newPassword) {
        return res.status(400).json({
          message: "New password cannot be the same as old password",
        });
      }
      validatePassword(newPassword);
      const superAdmin = req.user;
      const isMatch = await bcrypt.compare(oldPassword, superAdmin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      superAdmin.password = await bcrypt.hash(newPassword, 10);
      await superAdmin.save();
      res.json({
        message: `${superAdmin.name} your password is updated succesfully.`,
        data: superAdmin,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// PATCH API to update admin details
superAdminRouter.patch(
  "/superadmin/admin/:adminId",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      ValidateEditData(req);
      const _id = req.params.adminId;
      const admin = await Admin.findById({ _id: _id });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      Object.keys(req.body).forEach((key) => {
        admin[key] = req.body[key];
      });
      await admin.save();
      res.status(200).json({
        message: "admin details updated successfully",
        data: admin,
      });
      await sendMail({
        to: admin.email,
        subject: "Updated details of Complaint Portal",
        text: `Your admin account details were updated by a Super Admin.\n\n Your Updated details are as follows : \n\n Email: ${admin.email}\n Department: ${admin.department}\n\n Your password is unchanged so you can use your old password to login.`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// PATCH API to update student details
superAdminRouter.patch(
  "/superadmin/student/:studentId",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      ValidateEditData(req);
      const _id = req.params.studentId;
      const student = await Student.findById({ _id: _id });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      Object.keys(req.body).forEach((key) => {
        student[key] = req.body[key];
      });
      await student.save();
      res.status(200).json({
        message: "student details updated successfully",
        data: student,
      });
      await sendMail({
        to: student.email,
        subject: "Updated details of Complaint Portal",
        text: `Your student account details were updated by a Super Admin.\n\n Your Updated details are as follows : \n\n Email: ${student.email}\n RollNumber: ${student.rollNumber}\n\n Your password is unchanged so you can use your old password to login.`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET API to get monthly complaints count for the last 6 months
superAdminRouter.get(
  "/superadmin/complaints/monthly",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    try {
      const now = new Date();
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

      const results = await Complaint.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      const monthMap = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const response = {};
      results.forEach(({ _id, count }) => {
        const monthName = monthMap[_id.month - 1];
        response[monthName] = count;
      });

      res.json(response);
    } catch (err) {
      console.error("Monthly complaint aggregation error:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// GET API to get complaints count by department
superAdminRouter.get(
  "/superadmin/complaints/by-department",
  userAuth,
  isSuperAdmin,
  async (req, res) => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    try {
      const result = await Complaint.aggregate([
        { $unwind: "$tags" }, // flatten the tags array
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            tag: "$_id",
            count: 1,
            _id: 0,
          },
        },
      ]);

      // Convert to object like { "BH4": 5, "Mess": 2 }
      const response = {};
      result.forEach((item) => {
        response[item.tag] = item.count;
      });

      res.json(response);
    } catch (err) {
      console.error("Error grouping complaints by tags:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Temporary storing uploaded file
const upload = multer({ dest: "uploads/" });
// POST API for bulk uploading students from a CSV file
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
      const alreadyCreated = [];
      const failedToCreate = [];

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          const operations = [];

          for (const row of results) {
            let { name, email, rollNumber } = row;

            // Validate input fields
            if (!name?.trim() || !email?.trim() || !rollNumber?.trim()) {
              failedToCreate.push({
                name: name || "-",
                email: email || "-",
                rollNumber: rollNumber || "-",
                reason: "Missing required fields",
              });
              continue;
            }

            // Check for duplicate
            const existingUser = await Student.findOne({ email });
            if (existingUser) {
              alreadyCreated.push({
                name,
                email,
                rollNumber,
              });
              continue;
            }

            try {
              rollNumber = rollNumber.toUpperCase();
              const randpassword = generatePassword(8);
              validatePassword(randpassword); // throws if invalid
              const passwordHash = await bcrypt.hash(randpassword, 10);

              const student = new Student({
                name,
                email,
                rollNumber,
                password: passwordHash,
                role: "student",
              });

              const op = student
                .save()
                .then(() =>
                  sendMail({
                    to: email,
                    subject: "Welcome to Complaint Portal",
                    text: `Your student account is created.\n\nYour credentials:\nEmail: ${email}\nPassword: ${randpassword}\n\nPlease change your password after logging in.`,
                  }).catch((err) => {
                    console.error("Email error:", email, err.message);
                  })
                )
                .catch((err) => {
                  console.error("DB Save error:", email, err.message);
                  failedToCreate.push({
                    name,
                    email,
                    rollNumber,
                    reason: "Database save error",
                  });
                });

              operations.push(op);
            } catch (err) {
              failedToCreate.push({
                name,
                email,
                rollNumber,
                reason: err.message || "Invalid data",
              });
            }
          }

          await Promise.allSettled(operations);

          fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });

          res.status(201).json({
            message: "Bulk student creation completed.",
            alreadyCreated,
            failedToCreate,
          });
        });
    } catch (err) {
      console.error("Unexpected Error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);



// DELETE API for bulk deleting students from a CSV file using DELETE method
superAdminRouter.delete(
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
      const notFound = [];
      const failedDeletions = [];

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          const operations = [];

          for (const row of results) {
            let { rollNumber } = row;

            if (!rollNumber?.trim()) continue;
            rollNumber = rollNumber.toUpperCase().trim();

            const op = Student.findOne({ rollNumber })
              .then(async (student) => {
                if (!student) {
                  notFound.push({
                    rollNumber,
                    reason: "Student not found in DB",
                  });
                  return;
                }

                try {
                  await Complaint.deleteMany({ studentId: student._id });

                  const deleteResult = await Student.deleteOne({ _id: student._id });
                  if (deleteResult.deletedCount === 0) {
                    failedDeletions.push({
                      rollNumber,
                      reason: "Student found but could not be deleted",
                    });
                  }
                } catch (err) {
                  failedDeletions.push({
                    rollNumber,
                    reason: `Error while deleting: ${err.message}`,
                  });
                }
              })
              .catch((err) => {
                failedDeletions.push({
                  rollNumber,
                  reason: `Unexpected error: ${err.message}`,
                });
              });

            operations.push(op);
          }

          await Promise.allSettled(operations);

          fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting uploaded CSV file:", err);
          });

          res.status(200).json({
            message: "Deletion process completed.",
            failedDeletions,
            notFound,
          });
        });
    } catch (err) {
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  }
);


module.exports = superAdminRouter;
