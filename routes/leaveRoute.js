const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');


// POST route to create a new employee
router.get('/leaveTaken/:id', leaveController.leavesTaken);
router.get('/leavePending/:id', leaveController.pendingLeaves);
router.get('/totalLeaves/:id', leaveController.totalLeaves);

module.exports = router;