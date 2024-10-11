const HRMEmployee = require('../models/HRMEmployeeModel');

const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;
    
    // Creating a new employee instance
    const newEmployee = new HRMEmployee(employeeData);

    // Saving the employee to the database
    await newEmployee.save();

    // Sending a success response
    res.status(201).json({
      message: 'Employee created successfully',
      data: newEmployee
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating employee',
      error: error.message
    });
  }
};

module.exports = {
    createEmployee
};