const multer = require('multer');
const fs = require('fs');
const path = require('path');

// ✅ Destination folder (single folder for all uploads)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // same folder for all
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "photo" &&
    !file.mimetype.match(/^image\/jpeg$/)
  ) {
    return cb(new Error("Only JPG/JPEG files allowed for photo."));
  }

  // allow all types for marksheets
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 5MB for all
  fileFilter,
});




module.exports = upload;
