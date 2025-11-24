const express = require('express');
const router = express.Router();
const { listPersonnel, updatePersonnel, seedPersonnel, changeWorkload, createPersonnel } = require('../controllers/personnelController');

router.get('/', listPersonnel);
router.put('/:id', updatePersonnel);
router.put('/:id/workload', changeWorkload);
router.post('/seed', seedPersonnel);
router.post('/', createPersonnel);

module.exports = router;
