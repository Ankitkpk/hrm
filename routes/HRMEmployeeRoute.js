const express = require('express');
const router = express.Router();
const HRMEmployeeController = require('../controllers/HRMEmployeeController');


// POST route to create a new employee
router.post('/employee', HRMEmployeeController.createEmployee);

// Route to update password
router.post('/updatePassword', HRMEmployeeController.updatePassword);


 router.post('/employeeLogin', HRMEmployeeController.loginEmployee);

 router.get('/getAllEmployeeDetails',HRMEmployeeController.getAllEmployeeDetails);
 
 router.get('/getEmployeeById/:id',HRMEmployeeController.getEmployeeById);
module.exports = router; 