const express = require('express');
const Student = require('../model/Student');
const upload = require('../middleware/upload');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');
// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // Your app password
    
  }
});


// Send email helper
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
  } catch (err) {
    console.error('Email error:', err);
  }
};

// File upload route
// File upload route
router.post(
  '/',
  (req, res, next) => {
    upload.fields([
      { name: 'tenthMarksheet', maxCount: 1 },
      { name: 'twelfthMarksheet', maxCount: 1 },
      { name: 'photo', maxCount: 1 },
    ])(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `File too large. Max size is 5MB.` });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { files, body } = req;
      const student = new Student({
        ...body,
        semester: parseInt(body.semester),
        tenthMarksheet: files.tenthMarksheet[0].filename,
        twelfthMarksheet: files.twelfthMarksheet[0].filename,
        photo: files.photo[0].filename,
        status: 'pending',
        approved: false,
      });

      await student.save();

      // ✅ Send email with registration number (_id)
      await sendEmail(
        student.email,
        '🎓 Registration Successful - AKGEC',
        `
          <p>Dear ${student.name},</p>
          <p>Thank you for registering at AKGEC.</p>
          <p>Your registration has been received successfully.</p>
          <p><strong>Registration Number:</strong> ${student._id}</p>
          <p>We will review your application and notify you shortly.</p>
          <p>Best regards,<br/>AKGEC Administration</p>
        `
      );

      res.status(201).json(student);
    } catch (err) {
      console.error('Error saving student:', err);
      res.status(400).json({ error: err.message });
    }
  }
);


// ✅ GET: Fetch all students or filter by status/approval
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    } else if (req.query.approved) {
      filter.approved = req.query.approved === 'true';
    }
    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT: Approve student and send email
// ✅ PUT: Approve student and send email
const Counter = require('../model/counter.model');


// ✅ PUT: Approve student and send email
router.put('/:id/approve', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const year = new Date().getFullYear();
    const counterId = `rollNumber-${year}`;

    // Generate sequential roll number
    const counter = await Counter.findOneAndUpdate(
      { _id: counterId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const sequence = counter.seq.toString().padStart(3, '0'); // 001, 002, ...
    const rollNumber = `${year}400${sequence}`;

    student.rollNumber = rollNumber;
    student.status = 'approved';
    student.approved = true;

    await student.save();

    // ✅ Enhanced Approval Email
    await sendEmail(
      student.email,
      '🎉 Application Approved - AKGEC',
      `
        <p>Dear ${student.name},</p>
        <p>Thank you for registering with <strong>Ajay Kumar Garg Engineering College (AKGEC)</strong>.</p>
        <p>We are pleased to inform you that your application <strong>(Registration No: ${student._id})</strong> has been approved.</p>
        <p><strong>Your Roll Number:</strong> ${rollNumber}</p>
        <p>We look forward to having you as part of our academic community.</p>
        <p>Best wishes for your educational journey!</p>
        <p><br/>Warm regards,<br/>AKGEC Admission Team</p>
      `
    );

    res.json(student);
  } catch (err) {
    console.error('Approval error:', err);
    res.status(500).json({ error: err.message });
  }
});




// ✅ PUT: Reject student with reason and send email
// ✅ PUT: Reject student with reason and send email
router.put('/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ error: 'Rejection reason is required.' });
    }

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { approved: false, status: 'rejected' },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Student not found' });

    // ✅ Rejection Email with registration number
    await sendEmail(
      updated.email,
      '❌ Application Rejected - AKGEC',
      `
        <p>Dear Candidate,</p>
        <p>We regret to inform you that your application <strong>(Registration No: ${updated._id})</strong> has not been approved.</p>
        <p><strong>Reason for Rejection:</strong> ${reason}</p>
        <p>We appreciate your interest in AKGEC and wish you the best in your future endeavors.</p>
        <p>Best regards,<br/>AKGEC Admission Team</p>
      `
    );

    res.json({ message: 'Student rejected', student: updated });
  } catch (err) {
    console.error('Rejection error:', err);
    res.status(400).json({ error: err.message });
  }
});


// ✅ DELETE: Remove student
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: err.message });
  }
});



router.get('/test-email', async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'annuprajapati0004@gmail.com',
      subject: 'Test Email',
      html: '<h1>This is a test email from your app</h1>',
    });
    res.send('✅ Test email sent');
  } catch (err) {
    console.error('❌ Failed to send test email:', err);
    res.status(500).send('❌ Email failed');
  }
});


module.exports = router;
