const express = require('express');
const router = express.Router();
const HRMEmployeeController = require('../controllers/HRMEmployeeController');


// POST route to create a new employee
router.post('/employee', HRMEmployeeController.createEmployee);

module.exports = router;