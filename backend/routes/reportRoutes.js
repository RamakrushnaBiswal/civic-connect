const express = require('express');
const router = express.Router();
const { addReport,showReports,getReportById,updateReport } = require('../controllers/reportController');

const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/add-report', upload.single('photo'), addReport);
router.get('/show-reports', showReports);
router.get('/reports/:id', getReportById);
router.put('/reports/:id', updateReport);

module.exports = router;
