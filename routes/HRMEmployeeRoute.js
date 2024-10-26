const express = require('express');
const router = express.Router();
const HRMEmployeeController = require('../controllers/HRMEmployeeController');


// POST route to create a new employee
router.post('/createEmployee', HRMEmployeeController.createEmployee);

// Route to update password
router.post('/updatePassword', HRMEmployeeController.updatePassword);


 router.post('/employeeLogin', HRMEmployeeController.loginEmployee);

 router.get('/getAllEmployeeDetails',HRMEmployeeController.getAllEmployeeDetails);
 
 router.get('/getEmployeeById/:id',HRMEmployeeController.getEmployeeById);
 router.get("/getEmployeeByIdForAttendance/:id", HRMEmployeeController.getEmployeeByIdForAttendance);

 router.get('/getUpcomingMeet/:id',HRMEmployeeController.upcomingMeeting)
 router.get('/closeMeeting/:id',HRMEmployeeController.getNextMeet)
 router.get('/HrmEmployeeSearching',HRMEmployeeController.HrmEmployeeSearching) //for searching
 router.put('/HrmEmployeeUpdate/:id',HRMEmployeeController.HrmEmployeeUpdate)
 router.get('/getPayslipGenerationStatus',HRMEmployeeController.getPayslipGenerationStatus)
 router.get('/getEmployeePayslipList',HRMEmployeeController.getEmployeePaySlipList);
 router.get('/getDesignations',HRMEmployeeController.getDesignations)

module.exports = router; 