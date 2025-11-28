const express = require('express');
const router = express.Router();
const { addReport,showReports,getReportById,updateReport, assignReport,unassignReport, getMyReports, updateStatusByPersonnel, getAssignedReportsForPersonnel } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const personnelAuth = require('../middleware/personnelAuth');

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
router.get('/my-reports', authMiddleware, getMyReports);
router.get('/assigned', personnelAuth, getAssignedReportsForPersonnel);
router.get('/:id', getReportById);
router.put('/:id', updateReport);
router.put('/:id/assign', assignReport);
router.put('/:id/unassign', unassignReport);
router.put('/:id/status', personnelAuth, updateStatusByPersonnel);

module.exports = router;
