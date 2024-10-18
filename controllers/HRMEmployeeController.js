const HRMEmployee = require("../models/HRMEmployeeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require('moment');

const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;

    // Creating a new employee instance
    const newEmployee = new HRMEmployee(employeeData);

    // Saving the employee to the database
    await newEmployee.save();

    // Sending a success response
    res.status(201).json({
      message: "Employee created successfully",
      data: newEmployee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating employee",
      error: error.message,
    });
  }
};

// Update employee password by empId
const updatePassword = async (req, res) => {
  const { empId, newPassword } = req.body;

  try {
    // Find the employee by empId
    const employee = await HRMEmployee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the employee's password
    employee.empPassword = hashedPassword;
    await employee.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};

const loginEmployee = async (req, res) => {
  const { officialEmailId, empPassword } = req.body;
  
  try {
    
    
    // Find the employee by email
    const employee = await HRMEmployee.findOne({ officialEmailId });
    if (!employee) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the employee has a stored password
    if (!employee.empPassword) {
      return res.status(400).json({ message: "Password not set for this employee" });
    }

    // Check if the password is valid
    const isMatch = await bcrypt.compare(empPassword, employee.empPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ empId: employee.empId }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send token back to client
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllEmployeeDetails = async (req, res) => {
  try {
    // Fetch all employee details
    const getData = await HRMEmployee.find();
    
    // Send a successful response with the employee data
    res.status(200).json(getData);
  } catch (error) {
    // Log the error and send an error response
    console.error('Error fetching employee details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {

    // Get current date and time using moment
    const currentDate = moment().format('DD MMM YYYY'); // e.g., "18 Oct 2024"
    const currentTime = moment().format('h:mm A'); // e.g., "10:11 AM"
    
   

    // Fetch employee details from the database
    const data = await HRMEmployee.findById(id).select('empId department jobTitle');
    
    // Send both employee data and date/time in the response
    res.status(200).json({
      employeeDetails: data,
      currentDate,
      currentTime
    });
  } 
  catch (error) { 
    console.error('Error fetching employee details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createEmployee,
  updatePassword,
  loginEmployee,
  getAllEmployeeDetails,
  getEmployeeById
};
 