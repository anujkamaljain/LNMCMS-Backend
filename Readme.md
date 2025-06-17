# 🛠️ LNMCMS - Backend

This is the **backend** repository for **LNMCMS (LNM Complaint Management System)** — a role-based complaint redressal system designed for educational institutions.

Built with **Node.js**, **Express**, **MongoDB**, and **JWT**, this backend handles authentication, role management, complaint handling, email integration, and student onboarding via CSV.

> 💡 Project by [Anuj Jain](https://github.com/anujkamaljain) & [Anmol](https://github.com/AnmolSanger)

---

## 🚀 Live Demo

* **Frontend**: [https://lnmcms-frontend.vercel.app](https://lnmcms-frontend.vercel.app)
* **Frontend Repo**: [LNMCMS-Frontend](https://github.com/anujkamaljain/LNMCMS-Frontend)
* **Backend**: Hosted on **Render**

---

## 📌 API Base URL

```bash
https://lnmcms-backend.onrender.com
```

---

## ✨ Features

* 🔐 **JWT Authentication** with secure password hashing
* 🧑‍🎓 **Role-based access**: Student, Admin, Superadmin
* 📬 **Nodemailer integration** for sending credentials on CSV upload
* 📄 **CSV upload** to register multiple students at once
* 📂 **Complaint management** with status updates
* 📊 **Dashboard analytics** support for charting (monthly complaint stats)
* ❌ Change password disabled for dummy accounts

---

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB** with **Mongoose**
* **JWT** for authentication
* **Bcrypt** for password encryption
* **Nodemailer** for sending email
* **Multer** for CSV file uploads
* **Cors** for cross-origin support

---

## 📦 Installation & Setup

### 1. Clone the Repo

```bash
git clone https://github.com/anujkamaljain/LNMCMS-Backend.git
cd LNMCMS-Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

```env
DB_URL = Your mongoDB url
PORT = 7777
JWT_SECRET = anything you want
EMAIL_USER = your email
EMAIL_PASS = your gmail app password not your email password
```

> Replace with your own credentials (use environment variables in production).

### 4. Start the Server

```bash
npm run dev
```

---

## 🔐 API Endpoints Overview

* Check the API_LIST.md for the API details

> All routes are protected and role-specific using middleware.

---

## 🧪 Dummy Login Credentials for Testing

### 👨‍🎓 Student

* Email: `23ucs540@lnmiit.ac.in`
* Password: `Anuj@1234`

### 🧑‍💼 Admin

* Email: `anujkjain@lnmiit.ac.in`
* Password: `Anuj@1234`

### 🔒 Superadmin

Superadmin credentials are **restricted** to prevent unauthorized CSV uploads, email spam, or data deletion.

---

## 👨‍💻 Authors

* [Anuj Jain](https://github.com/anujkamaljain)
* [Anmol Sanger](https://github.com/AnmolSanger)


---

## 🙌 Contributing

We welcome feedback, issues, and PRs to improve this system further.
If you’d like to extend the project, feel free to fork it and contribute!

