<div align="center">

# 🛠️ LNMCMS Backend
### **LNM Complaint Management System - Backend API**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

**A robust, scalable, and feature-rich RESTful API for educational institution complaint management**

[🚀 Live API](https://lnmcms-backend.onrender.com) • [📱 Frontend Repository](https://github.com/anujkamaljain/LNMCMS-Frontend) • [🐛 Report Bug](https://github.com/anujkamaljain/LNMCMS-Backend/issues) • [✨ Request Feature](https://github.com/anujkamaljain/LNMCMS-Backend/issues)

</div>

---

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📚 API Documentation](#-api-documentation)
- [🔐 Authentication](#-authentication)
- [💬 Real-time Features](#-real-time-features)
- [📁 File Upload System](#-file-upload-system)
- [📧 Email Integration](#-email-integration)
- [🏗️ Project Structure](#️-project-structure)
- [🧪 Testing](#-testing)
- [📦 Deployment](#-deployment)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)
- [👥 Authors](#-authors)
- [📄 License](#-license)

---

## 🌟 Features

### 🔐 **Advanced Authentication & Authorization**
- **JWT-based Authentication**: Secure token-based authentication with HTTP-only cookies
- **Role-based Access Control**: Student, Admin, and SuperAdmin roles with granular permissions
- **Password Security**: Bcrypt hashing with salt rounds for secure password storage
- **Session Management**: Automatic token refresh and secure logout
- **Middleware Protection**: Route-level authentication and authorization

### 📝 **Comprehensive Complaint Management**
- **Multi-category Support**: Hostel, Academic, Mess, Library, Sports, and more
- **Status Workflow**: Pending → Accepted → Resolved with automatic notifications
- **Media Attachments**: Support for images, documents, and videos via Cloudinary
- **Location Tracking**: Campus location-based complaint routing
- **Time Availability**: Student availability scheduling for complaint resolution
- **Public/Private Visibility**: Community-driven complaint discovery system
- **Upvoting System**: Student-driven complaint prioritization

### 💬 **Real-time Communication System**
- **Socket.IO Integration**: WebSocket-based real-time messaging
- **Complaint-specific Chats**: Contextual conversations linked to complaints
- **Read Receipts**: Message delivery and read status tracking
- **Unread Message Count**: Real-time notification system
- **Message Persistence**: Complete chat history with MongoDB storage

### 📊 **Advanced Analytics & Reporting**
- **Department-wise Statistics**: Automated complaint distribution analysis
- **Monthly Trends**: Time-based complaint pattern analysis
- **Status Tracking**: Real-time complaint status monitoring
- **Performance Metrics**: Admin and department performance analytics
- **Export Capabilities**: Data export for reporting and analysis

### 👥 **User Management System**
- **Bulk Student Registration**: CSV upload with automatic email notifications
- **Admin Management**: Create, update, and manage admin accounts
- **SuperAdmin Controls**: Global system administration and oversight
- **Profile Management**: User profile updates and password changes
- **Account Deactivation**: Soft delete with data retention policies

### 📧 **Email Integration**
- **Automated Notifications**: Complaint status updates and system notifications
- **Bulk Email Sending**: Mass communication for student onboarding
- **Credential Delivery**: Automatic login credential distribution
- **Template System**: Customizable email templates for different scenarios
- **Delivery Tracking**: Email delivery status monitoring

### 📁 **File Management System**
- **Cloudinary Integration**: Secure cloud-based file storage
- **Multiple File Types**: Support for images, documents, and videos
- **File Validation**: Type and size validation with security checks
- **Automatic Optimization**: Image compression and format optimization
- **CDN Delivery**: Fast global content delivery

---

## 🛠️ Tech Stack

### **Backend Core**
- **🚀 Node.js 18+** - JavaScript runtime environment
- **⚡ Express.js 5.1.0** - Fast, unopinionated web framework
- **🍃 MongoDB 6.19.0** - NoSQL document database
- **🔗 Mongoose 8.18.0** - MongoDB object modeling for Node.js

### **Authentication & Security**
- **🔐 JWT 9.0.2** - JSON Web Token for secure authentication
- **🛡️ Bcrypt 6.0.0** - Password hashing and salting
- **🍪 Cookie Parser 1.4.7** - HTTP cookie parsing middleware
- **🌐 CORS 2.8.5** - Cross-Origin Resource Sharing

### **Real-time Communication**
- **📡 Socket.IO 4.8.1** - Real-time bidirectional event-based communication
- **🔄 WebSocket Support** - Native WebSocket fallback

### **File Management**
- **☁️ Cloudinary 1.41.3** - Cloud-based image and video management
- **📤 Multer 2.0.2** - Multipart/form-data handling
- **📊 CSV Parser 3.2.0** - CSV file processing

### **Email & Communication**
- **📧 Nodemailer 7.0.3** - Email sending library
- **📝 Email Templates** - Customizable email templates

### **Development & Utilities**
- **🔧 Nodemon 3.1.10** - Development server with auto-restart
- **🌍 Dotenv 16.6.1** - Environment variable management
- **✅ Validator 13.15.15** - String validation and sanitization

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- npm or yarn package manager
- Cloudinary account (for file uploads)
- Gmail App Password (for email functionality)

### **Installation**

```bash
# Clone the repository
git clone https://github.com/anujkamaljain/LNMCMS-Backend.git
cd LNMCMS-Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### **Environment Configuration**

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_URL=mongodb://localhost:27017/lnmcms
PORT=7777

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### **Start Development Server**

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### **API Base URL**
```
Development: http://localhost:7777
Production: https://lnmcms-backend.onrender.com
```

---

## 📚 API Documentation

### **🔐 Authentication Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/login` | User login with role selection | ❌ |
| `POST` | `/logout` | User logout and token invalidation | ✅ |

### **👨‍🎓 Student Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/student/complaint` | Submit new complaint with media | ✅ |
| `GET` | `/student/complaints/pending` | Get pending complaints | ✅ |
| `GET` | `/student/complaints/accepted` | Get accepted complaints | ✅ |
| `GET` | `/student/complaints/resolved` | Get resolved complaints | ✅ |
| `GET` | `/student/complaints/public` | Get public complaints for discovery | ✅ |
| `PATCH` | `/student/complaint/upvote/:id` | Upvote a public complaint | ✅ |
| `PATCH` | `/student/complaints/:id/resolve` | Mark complaint as resolved | ✅ |
| `PATCH` | `/student/changepassword` | Change student password | ✅ |
| `GET` | `/student/profile` | Get student profile | ✅ |
| `PATCH` | `/student/profile` | Update student profile | ✅ |

### **🧑‍💼 Admin Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/admin/complaints/pending` | Get department pending complaints | ✅ |
| `GET` | `/admin/complaints/accepted` | Get department accepted complaints | ✅ |
| `GET` | `/admin/complaints/resolved` | Get department resolved complaints | ✅ |
| `PATCH` | `/admin/complaint/:id/accept` | Accept a pending complaint | ✅ |
| `PATCH` | `/admin/changepassword` | Change admin password | ✅ |
| `GET` | `/admin/profile` | Get admin profile | ✅ |
| `PATCH` | `/admin/profile` | Update admin profile | ✅ |

### **👑 SuperAdmin Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/superadmin/students` | Bulk student registration via CSV | ✅ |
| `POST` | `/superadmin/student` | Add single student | ✅ |
| `POST` | `/superadmin/admin` | Add new admin | ✅ |
| `POST` | `/superadmin/superadmin` | Add new superadmin | ✅ |
| `GET` | `/superadmin/students` | Get all students with pagination | ✅ |
| `GET` | `/superadmin/admins` | Get all admins | ✅ |
| `DELETE` | `/superadmin/student/:id` | Delete student | ✅ |
| `DELETE` | `/superadmin/admin/:id` | Delete admin | ✅ |
| `PATCH` | `/superadmin/student/:id` | Update student details | ✅ |
| `PATCH` | `/superadmin/admin/:id` | Update admin details | ✅ |
| `PATCH` | `/superadmin/changepassword` | Change superadmin password | ✅ |
| `GET` | `/superadmin/complaints/by-department` | Get department-wise statistics | ✅ |
| `GET` | `/superadmin/complaints/monthly` | Get monthly complaint trends | ✅ |

### **📁 Media Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/media/upload` | Upload media files to Cloudinary | ✅ |
| `DELETE` | `/media/delete/:publicId` | Delete media file from Cloudinary | ✅ |

### **💬 Chat Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/chat/:targetUserId` | Get chat messages with user | ✅ |
| `POST` | `/chat/:targetUserId` | Send message to user | ✅ |
| `POST` | `/chat/:targetUserId/read` | Mark messages as read | ✅ |
| `GET` | `/chat/unread-count` | Get unread message count | ✅ |

---

## 🔐 Authentication

### **JWT Token Structure**
```json
{
  "userId": "64a1b2c3d4e5f6789abcdef0",
  "role": "student|admin|superAdmin",
  "email": "user@lnmiit.ac.in",
  "iat": 1640995200,
  "exp": 1641024000
}
```

### **Cookie Configuration**
```javascript
{
  httpOnly: true,
  sameSite: "None",
  secure: true,
  maxAge: 1000 * 60 * 60 * 8, // 8 hours
  path: "/"
}
```

### **Role-based Access Control**
- **Student**: Can submit complaints, view own complaints, chat with admins
- **Admin**: Can manage department complaints, accept/resolve complaints
- **SuperAdmin**: Full system access, user management, analytics

---

## 💬 Real-time Features

### **Socket.IO Events**

#### **Client → Server Events**
```javascript
// Join user-specific room
socket.emit('join', { userId, role });

// Send message
socket.emit('sendMessage', {
  targetUserId,
  text,
  complaintId // optional
});

// Mark messages as read
socket.emit('markAsRead', { targetUserId, complaintId });
```

#### **Server → Client Events**
```javascript
// New message received
socket.on('newMessage', (message) => {
  // Handle new message
});

// Message read receipt
socket.on('messageRead', (data) => {
  // Handle read receipt
});

// Unread count update
socket.on('unreadCountUpdate', (count) => {
  // Update unread count
});
```

### **Room Management**
- **User Rooms**: Each user has a personal room for notifications
- **Chat Rooms**: Dynamic rooms for user-to-user conversations
- **Complaint Rooms**: Context-specific rooms for complaint discussions

---

## 📁 File Upload System

### **Supported File Types**
- **Images**: JPG, JPEG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX, TXT
- **Videos**: MP4, AVI, MOV (up to 100MB)

### **Upload Process**
1. **Client Upload**: Files sent to `/media/upload` endpoint
2. **Validation**: File type, size, and security validation
3. **Cloudinary Upload**: Files uploaded to cloud storage
4. **Database Storage**: File metadata stored in MongoDB
5. **URL Generation**: Public URLs generated for frontend access

### **File Management**
```javascript
// Upload multiple files
const formData = new FormData();
files.forEach(file => formData.append('media', file));

// Response format
{
  "message": "Files uploaded successfully",
  "data": {
    "files": [
      {
        "publicId": "lnmcms/abc123",
        "url": "https://res.cloudinary.com/...",
        "format": "jpg",
        "size": 1024000
      }
    ],
    "count": 3
  }
}
```

---

## 📧 Email Integration

### **Email Templates**
- **Welcome Email**: New student registration
- **Complaint Status**: Status change notifications
- **Password Reset**: Password reset instructions
- **System Notifications**: Important system updates

### **Bulk Email Features**
- **CSV Processing**: Automatic email sending for bulk student registration
- **Template Variables**: Dynamic content insertion
- **Delivery Tracking**: Email delivery status monitoring
- **Error Handling**: Failed delivery retry mechanism

### **Email Configuration**
```javascript
// Nodemailer configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Gmail App Password
  }
});
```

---

## 🏗️ Project Structure

```
LNMCMS-Backend/
├── 📁 src/
│   ├── 📁 config/             # Configuration files
│   │   ├── 🗄️ database.js     # MongoDB connection
│   │   └── ☁️ cloudinary.js   # Cloudinary configuration
│   ├── 📁 helpers/            # Utility functions
│   │   ├── 🔐 validateUserAndGenerateToken.js
│   │   └── ✅ validation.js   # Input validation
│   ├── 📁 middlewares/        # Express middlewares
│   │   ├── 🔐 userAuth.js     # Authentication middleware
│   │   ├── 👨‍🎓 isStudent.js   # Student role middleware
│   │   ├── 🧑‍💼 isAdmin.js     # Admin role middleware
│   │   ├── 👑 isSuperAdmin.js # SuperAdmin role middleware
│   │   └── 📁 fileUpload.js   # File upload middleware
│   ├── 📁 models/             # MongoDB models
│   │   ├── 👨‍🎓 students.js    # Student model
│   │   ├── 🧑‍💼 admins.js      # Admin model
│   │   ├── 👑 superAdmins.js  # SuperAdmin model
│   │   ├── 📝 complaints.js   # Complaint model
│   │   └── 💬 chat.js         # Chat model
│   ├── 📁 routes/             # API routes
│   │   ├── 🔐 auth.js         # Authentication routes
│   │   ├── 👨‍🎓 student.js     # Student routes
│   │   ├── 🧑‍💼 admin.js       # Admin routes
│   │   ├── 👑 superAdmin.js   # SuperAdmin routes
│   │   ├── 📁 media.js        # Media upload routes
│   │   └── 💬 chat.js         # Chat routes
│   ├── 📁 utils/              # Utility functions
│   │   ├── 📧 sendMail.js     # Email utilities
│   │   ├── 🔑 generatePassword.js
│   │   └── 📡 socket.js       # Socket.IO configuration
│   └── 📄 app.js              # Main application file
├── 📁 uploads/                # Temporary file storage
├── 📄 package.json            # Dependencies and scripts
└── 📄 API_LIST.md            # API endpoint documentation
```

---

## 🧪 Testing

### **API Testing with Postman**
1. Import the Postman collection
2. Set environment variables
3. Run the authentication flow
4. Test all endpoints with proper authentication

### **Load Testing**
```bash
# Install artillery for load testing
npm install -g artillery

# Run load test
artillery run load-test.yml
```

### **Database Testing**
```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017/lnmcms"

# Run test queries
db.complaints.find().limit(5)
db.students.countDocuments()
```

---

## 📦 Deployment

### **🌐 Render Deployment**
```bash
# Connect GitHub repository to Render
# Set environment variables in Render dashboard
# Deploy automatically on git push
```

### **🐳 Docker Deployment**
```dockerfile
# Build Docker image
docker build -t lnmcms-backend .

# Run container
docker run -p 7777:7777 --env-file .env lnmcms-backend
```

### **☁️ Environment Variables**
```env
# Production environment variables
NODE_ENV=production
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/lnmcms
PORT=7777
JWT_SECRET=production-secret-key
EMAIL_USER=production-email@gmail.com
EMAIL_PASS=production-app-password
CLOUDINARY_CLOUD_NAME=production-cloud-name
CLOUDINARY_API_KEY=production-api-key
CLOUDINARY_API_SECRET=production-api-secret
```

---

## 🔒 Security

### **Authentication Security**
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevent XSS attacks
- **Password Hashing**: Bcrypt with salt rounds
- **Token Expiration**: 8-hour token lifetime
- **Secure Headers**: CORS and security headers

### **Data Validation**
- **Input Sanitization**: All inputs validated and sanitized
- **File Upload Security**: File type and size validation
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: Input encoding and validation

### **API Security**
- **Rate Limiting**: Request rate limiting (implement as needed)
- **CORS Configuration**: Restricted origin access
- **Environment Variables**: Sensitive data in environment variables
- **Error Handling**: Secure error messages without sensitive data

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **🐛 Bug Reports**
1. Check existing issues first
2. Use the bug report template
3. Provide detailed reproduction steps
4. Include error logs and screenshots

### **✨ Feature Requests**
1. Check existing feature requests
2. Use the feature request template
3. Describe the use case clearly
4. Consider implementation complexity

### **💻 Code Contributions**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### **📚 Documentation**
- Improve API documentation
- Add code examples
- Fix typos and grammar
- Add deployment guides

---

## 👥 Authors

<div align="center">

### **Anuj Jain**
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/anujkamaljain)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/anujkamaljain)

### **Anmol Sanger**
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AnmolSanger)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/anmolsanger)

</div>

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### **⭐ Star this repository if you found it helpful!**

**Built with ❤️ for the LNMIIT community**

[🚀 Live API](https://lnmcms-backend.onrender.com) • [📱 Frontend](https://lnmcms-frontend.vercel.app) • [🐛 Report Issue](https://github.com/anujkamaljain/LNMCMS-Backend/issues)

</div>