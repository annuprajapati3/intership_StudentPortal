
# 🎓 Student Portal

A full-stack web application built with the MERN stack to manage student registration, hostel requests, application approvals, and attendance tracking. Designed for both students and teachers, this system streamlines administrative workflows.

---

## 🚀 Features

### 👩‍🎓 Students
- Register and submit personal information.
- Upload 10th and 12th marksheets.
- Apply for hostel accommodation.
- Get notified via email on application status.
- View and download monthly attendance summary.

### 👨‍🏫 Teachers
- View student registration forms.
- Approve/reject applications with reasons.
- Assign roll numbers on approval.
- Mark attendance daily.
- View attendance by specific date.
- Export attendance as Excel files.

---

## 🛠️ Tech Stack

| Layer      | Technologies Used                  |
|------------|------------------------------------|
| Frontend   | React.js, Tailwind CSS             |
| Backend    | Node.js, Express.js                |
| Database   | MongoDB                            |
| File Upload| Multer                             |
| Auth       | JWT (JSON Web Tokens)              |
| Email      | Nodemailer                         |
| Excel      | ExcelJS                            |

---

## 📦 Installation

### 🔧 1. Clone the repository

```bash
git clone https://github.com/your-username/student-portal.git
cd student-portal
```

---

### 📁 2. Backend Setup

```bash
npm install
```

#### Create `.env` file in root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
```

---

### 💻 3. Frontend Setup

```bash
cd client
npm install
```

#### (Optional) Create `.env` file in `client/` if using any client-side environment variables:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 🚀 4. Running the App Locally

#### Start the backend server:

```bash
npm run dev
```

#### Start the frontend server (in a new terminal):

```bash
cd client
npm start
```

---

### 🌐 App URLs (Default)

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 📁 Folder Structure

```
student-portal/
├── client/                 # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.js
├── server/ or root files   # Express Backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── utils/
├── uploads/                # Uploaded marksheets
├── .env                    # Environment config
├── README.md
└── package.json
```

---

## 🧪 Sample .env File (Backend)

```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/student-portal
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

---



## 🙌 Acknowledgements

- Guided and mentored by **[Richa Jain]** at **JIL Information Technology**.
- Developed as part of a 6 weeks internship project focused on Web Development.

---

## 📫 Contact

**Annu Prajapati**  
📧 annuprajapati0004@gmail.com 
🔗 [LinkedIn](https://linkedin.com/in/annu-prajapati)

---

## ✅ Future Improvements

- Add role-based login system.
- Generate PDF report for attendance.
- Deploy on cloud platforms like Vercel or Render.
