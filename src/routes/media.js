const express = require("express");
const mediaRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const isStudent = require("../middlewares/isStudent");
const { uploadMultiple, handleUploadError, addFormattedFiles } = require("../middlewares/fileUpload");
const { deleteFromCloudinary } = require("../config/cloudinary");

// POST /media/upload - Upload media files for complaints
mediaRouter.post(
  "/media/upload",
  userAuth,
  isStudent,
  uploadMultiple('media', 3),
  addFormattedFiles,
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.formattedFiles || req.formattedFiles.length === 0) {
        return res.status(400).json({
          message: "No files uploaded. Please select at least one file."
        });
      }

      res.status(200).json({
        message: "Files uploaded successfully.",
        data: {
          files: req.formattedFiles,
          count: req.formattedFiles.length
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

// DELETE /media/delete/:publicId - Delete a specific media file
mediaRouter.delete(
  "/media/delete/:publicId",
  userAuth,
  isStudent,
  async (req, res) => {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        return res.status(400).json({
          message: "Public ID is required."
        });
      }

      const result = await deleteFromCloudinary(publicId);

      if (result.result === 'ok') {
        res.status(200).json({
          message: "File deleted successfully.",
          data: { publicId, deleted: true }
        });
      } else {
        res.status(404).json({
          message: "File not found or already deleted.",
          data: { publicId, deleted: false }
        });
      }
    } catch (err) {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

module.exports = mediaRouter;
