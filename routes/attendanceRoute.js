const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/markAttendance/:employeeId', attendanceController.attendance);

module.exports = router;