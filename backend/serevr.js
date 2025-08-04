const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const mongoose = require('mongoose');
const courseRoutes = require('./Routers/Courses');
const studentRoutes = require('./Routers/Student');
const applicationRoutes = require('./Routers/Application');
const attendance = require('./Routers/Attendance');
const QR = require('./Routers/QRgenartor')
const feedeatils = require('./Routers/StudentJoinFees')
const stMarks = require('./Routers/Studentmarks')
const Fine = require('./Routers/Fine')
const selectedcourses = require('./Routers/studentcourses')
const app = express();


app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB connection
mongoose.connect('mongodb://localhost:27017/studentDB')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Connection error:', err));


// Use courses route
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/attendance' , attendance);
app.use('/api' , QR);
app.use('/api' , feedeatils)
app.use('/api' , stMarks)
app.use('/api' , Fine)
app.use('/api' ,selectedcourses)
app.listen(5000, () => console.log('Server running on port 5000'))