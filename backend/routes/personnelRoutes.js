const express = require('express');
const router = express.Router();
const { listPersonnel, updatePersonnel, seedPersonnel, changeWorkload, createPersonnel, login, getAssignedReports, requestPasswordReset, resetPassword, changePassword } = require('../controllers/personnelController');
const personnelAuth = require('../middleware/personnelAuth');

router.get('/', listPersonnel);
router.put('/:id', updatePersonnel);
router.put('/:id/workload', changeWorkload);
router.post('/seed', seedPersonnel);
router.post('/', createPersonnel);
router.post('/login', login);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/me/change-password', personnelAuth, changePassword);
router.get('/me/reports', personnelAuth, getAssignedReports);

module.exports = router;
