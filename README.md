# 🎓 Student Portal

A web-based Student Portal designed to simplify student registration, hostel applications, approval workflows, and attendance tracking. Built using the MERN stack and designed with both students and teachers in mind.

---

## 🚀 Features

### 🔹 For Students:
- Submit personal details and documents (10th & 12th marksheets).
- Apply for hostel accommodation.
- Receive email notifications when approved or rejected.
- View attendance records with monthly summaries and percentage.
- Download attendance details.

### 🔹 For Teachers:
- View submitted student applications.
- Approve or reject applications with reason.
- Assign roll numbers upon approval.
- Mark daily attendance for approved students.
- Export attendance data to Excel.
- View attendance for a selected date.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **File Upload**: Multer
- **Authentication**: JWT
- **Email Notifications**: Nodemailer
- **Excel Export**: ExcelJS

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/student-portal.git
   cd student-portal
2. **Install dependencies**
  npm install        # for backend
  cd client
  npm install        # for frontend
3. **Configure environment variables**
  Create a .env file in the root with:
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password_or_app_password
4. **Run the app**
   # In backend folder
  npm run dev
  
  # In frontend (client) folder
  npm start
