const HRMEmployee = require("../models/HRMEmployeeModel");
const Meeting = require("../models/meeting.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const Company = require("../models/company.model");

const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;
    const company = await Company.findOne({
      name: employeeData.company,
    }).select("_id");
    employeeData["companyId"] = company._id;

    const hashedPassword = await bcrypt.hash(employeeData.empPassword, 10);

    employeeData.empPassword = hashedPassword;
    // Creating a new employee instance
    const newEmployee = new HRMEmployee(employeeData);

    // Update the employee's password
    // Saving the employee to the database
    await newEmployee.save();

    // Sending a success response
    return res.status(201).json({
      message: "Employee created successfully",
      data: newEmployee,
    });
  } catch (error) {
    return res.status(500).json({
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

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res
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
      return res
        .status(400)
        .json({ message: "Password not set for this employee" });
    }

    // Check if the password is valid
    const isMatch = await bcrypt.compare(empPassword, employee.empPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const companyId = await Company.findOne({ name: employee.company });

    // Generate JWT token
    const token = jwt.sign({ empId: employee.empId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send token back to client
    return res.json({
      message: "Login successful",
      token,
      id: employee._id,
      companyId: companyId._id,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getAllEmployeeDetails = async (req, res) => {
  try {
    // Fetch all employee details
    const getData = await HRMEmployee.find();

    // Send a successful response with the employee data
    return res.status(200).json(getData);
  } catch (error) {
    // Log the error and send an error response
    console.error("Error fetching employee details:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch employee details from the database
    const data = await HRMEmployee.findById(id).select(
      "empId department employeeName jobTitle"
    );

    // Send both employee data and date/time in the response
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching employee details:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getEmployeeByIdForAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await HRMEmployee.findById(id).select(
      "empId employeeName jobTitle -_id"
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const current_date = moment().format("MMMM DD, YYYY");
    const indiaTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    return res
      .status(200)
      .json({
        ...employee.toObject(),
        current_date: current_date,
        indiaTime: indiaTime,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//change it for email
const upcomingMeeting = async (req, res) => {
  const { id } = req.params;
  try {
    const today = new Date();
    const now = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const emp = await HRMEmployee.findById(id);
    // Find meetings where the participant's ID exists in the participants array
    const upcomingMeetings = await Meeting.find({
      participants: { $in: [emp.officialEmailId] },
      date: { $gte: now },
    })
      .sort({ date: 1, time: 1 })
      .lean();
    if (!upcomingMeetings || upcomingMeetings.length === 0) {
      return res
        .status(404)
        .json({ message: "No meetings found for this user" });
    }
    // Send the found meetings as a response
    return res.status(200).json(upcomingMeetings);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const getNextMeeting = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the employee by ID
    const emp = await HRMEmployee.findById(id);
    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Get current date and time in "Asia/Kolkata" timezone
    const now = moment().tz("Asia/Kolkata");

    console.log("Current Timestamp:", now.toISOString());
    console.log("Employee Email:", emp.officialEmailId);

    // Find the next meeting where the employee is a participant and the meeting is upcoming
    const upcomingMeeting = await Meeting.findOne({
      participants: { $in: [emp.officialEmailId] },
      date: { $gte: now.format("YYYY-MM-DD") },
      time: { $gte: now.format("hh:mm A") },
    })
      .sort({ date: 1, time: 1 })
      .limit(1);

    console.log("Upcoming Meetings:", upcomingMeeting);

    // Check if any meeting was found
    if (!upcomingMeeting) {
      return res
        .status(404)
        .json({ message: "No upcoming meetings found for this user" });
    }

    // Return the upcoming meeting
    return res.status(200).json(upcomingMeeting);
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const HrmEmployeeSearching = async (req, res) => {
  try {
    const { empId, employeeName, jobTitle } = req.query;

    // Check if all required fields are provided
    if (!empId || !employeeName || !jobTitle) {
      // check this
      return res
        .status(400)
        .json({
          message: "All fields are required: empId, employeeName, jobTItile.",
        });
    }

    const data = await HRMEmployee.find({
      empId,
      employeeName,
      jobTitle,
    }).select(
      "empId employeeName jobTitle department officialEmailId phoneNumber startDate manager officeLocation"
    );

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Employee Not Found." });
    }

    return res.status(200).json(...data);
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const HrmEmployeeUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const { department, manager, officeLocation } = req.body;

    if (!department && !manager && !officeLocation) {
      return res
        .status(400)
        .json({
          message:
            "At least one field is required to update: department, manager, or officeLocation.",
        });
    }

    const update = await HRMEmployee.findByIdAndUpdate(
      id,
      { department, manager, officeLocation },
      { new: true } // Include the new data in the response
    ).select(
      "empId employeeName jobTitle department officialEmailId phoneNumber startDate manager officeLocation"
    );

    if (!update) {
      return res
        .status(404)
        .json({ message: "Employee with this ID not found." });
    }

    return res.status(200).json({ message: "Updated Successfully", update });
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const getPayslipGenerationStatus = async (req, res) => {
  try {
    const data = await HRMEmployee.find().select(
      "empId employeeName paySlipStatus -_id"
    );
    if (!data.length === 0) {
      return res.status(404).json({ message: "No employee data found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const getEmployeePaySlipList = async (req, res) => {
  try {
    const data = await HRMEmployee.find().select(
      "empId salary employeeName jobTitle -_id"
    );
    if (!data.length === 0) {
      return res.status(404).json({ message: "No employee data found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const getDesignations = async (req, res) => {
  try {
    const data = await HRMEmployee.distinct("jobTitle");
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const HrmCoreEmployeeUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      empPassword,
      employeeName,
      qualification,
      grade,
      company,
      address,
      maritalStatus,
      city,
      zipCode,
      state,
      phoneNumber,
      alternatePhoneNumber,
      emergencyNumber,
      relationWithPerson,
      officialEmailId,
      personalEmailId,
      department,
      jobTitle,
      salary,
      aadharCard,
      panCard,
      bankAccountName,
      officeLocation,
      accountNumber,
      bankName,
      branchName,
      ifscCode,
    } = req.body;

    const updateData = {
      empPassword,
      employeeName,
      qualification,
      grade,
      company,
      address,
      maritalStatus,
      city,
      zipCode,
      state,
      phoneNumber,
      alternatePhoneNumber,
      emergencyNumber,
      relationWithPerson,
      officialEmailId,
      personalEmailId,
      department,
      jobTitle,
      salary,
      aadharCard,
      panCard,
      bankAccountName,
      officeLocation,
      accountNumber,
      bankName,
      branchName,
      ifscCode,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const update = await HRMEmployee.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select(
      'empPassword employeeName qualification grade company address maritalStatus city zipCode state phoneNumber alternatePhoneNumber emergencyNumber relationWithPerson officialEmailId personalEmailId department jobTitle salary aadharCard panCard bankAccountName officeLocation accountNumber bankName branchName ifscCode'
    );
    if (!update) {
      return res
        .status(404)
        .json({ message: "Employee with this ID not found." });
    }

    return res.status(200).json({ message: "Updated Successfully", update });
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const getHrmEmployeeList = async (req, res) => {
  try {
    const data = await HRMEmployee.find().select(
      "_id employeeName empId phoneNumber startDate jobTitle"
    );
    if (!data) {
      res.status(402).json({ message: "Data not Found" });
    }
    res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  createEmployee,
  updatePassword,
  loginEmployee,
  getAllEmployeeDetails,
  getEmployeeById,
  getEmployeeByIdForAttendance,
  upcomingMeeting,
  getNextMeeting,
  HrmEmployeeSearching,
  HrmEmployeeUpdate,
  getPayslipGenerationStatus,
  getEmployeePaySlipList,
  getDesignations,
  HrmCoreEmployeeUpdate,
  getHrmEmployeeList
};