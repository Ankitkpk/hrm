const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const multer = require('multer');

// Set up storage engine for photo uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Create new employee
router.post('/create', upload.fields([{ name: 'photo', maxCount: 1 }]), employeeController.addNewCandidate);

// Search employees
router.get('/search', employeeController.searchEmployees);

// Upload documents for employees
//router.post('/upload/:id', upload.single('file'), employeeController.uploadDocuments);

router.put('/upload/:id', upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'relievingLetter', maxCount: 1 },
    { name: 'bankDetails', maxCount: 1 },
    { name: 'aadharCard', maxCount: 1 },
    { name: 'postalAddress', maxCount: 1 },
    { name: 'permanentAddress', maxCount: 1 },
    {name:'photo', maxCount:1}
]), employeeController.uploadDocuments);

// View profile of an employee
router.get('/profile/:id', employeeController.viewProfile);

//Get Candidate Name
router.get('/getCandidateName',employeeController.getCandidateName)

// Get all employees
router.get('/', employeeController.getAllEmployees); 

module.exports = router;