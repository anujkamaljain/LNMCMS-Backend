const { upload } = require('../config/cloudinary');
const multer = require('multer'); // Import multer for error handling

// Middleware for handling multiple file uploads
const uploadMultiple = (fieldName = 'media', maxCount = 3) => {
  return upload.array(fieldName, maxCount);
};

// Error handling middleware for file upload errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File size too large. Maximum size allowed is 10MB per file.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files. Maximum 3 files allowed per upload.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'Unexpected file field. Please check the field name.'
      });
    }
  }
  
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      message: err.message
    });
  }
  
  // Generic error
  return res.status(500).json({
    message: 'File upload failed. Please try again.'
  });
};

// Helper function to format uploaded file data
const formatUploadedFile = (file) => {
  if (!file) return null;
  
  // Determine file type based on mime type
  let fileType = 'video'; // default
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    fileType = 'image';
  }
  
  // Extract public ID from filename (remove folder prefix)
  const publicId = file.filename.replace('lnmcms-complaints/', '');
  
  return {
    type: fileType,
    url: file.path, // Cloudinary URL is in 'path' field
    publicId: publicId, // Extract from filename
    filename: file.originalname, // Original filename
    size: file.size, // File size
    uploadedAt: new Date()
  };
};

// Helper function to format multiple uploaded files
const formatUploadedFiles = (files) => {
  if (!files) return [];
  
  if (Array.isArray(files)) {
    return files.map(formatUploadedFile).filter(file => file !== null);
  }
  
  return [formatUploadedFile(files)].filter(file => file !== null);
};

// Middleware to add formatted file data to request
const addFormattedFiles = (req, res, next) => {
  if (req.file) {
    req.formattedFile = formatUploadedFile(req.file);
  }
  
  if (req.files) {
    req.formattedFiles = formatUploadedFiles(req.files);
  }
  
  next();
};

module.exports = {
  uploadMultiple,
  handleUploadError,
  formatUploadedFile,
  formatUploadedFiles,
  addFormattedFiles
};
