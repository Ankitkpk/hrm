const HRMEmployee = require("../models/HRMEmployeeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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



module.exports = {
  createEmployee,
  updatePassword,
};
