/*(const Employee = require("../models/Employee");
const nodemailer = require("nodemailer");
const moment = require("moment");

const { State, City } = require("country-state-city");

// Create new employee

// change name to
const addNewCandidate = async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    positionApplied,
    department,
    dateOfBirth,
    joiningDate,
    employmentType,
    emergencyContact,
    residentialAddress,
  } = req.body;

  try {
    const { photo } = req.files;
    let ph;
    if (photo) {
      ph = photo[0]?.originalname;
    }

    const employee = new Employee({
      fullName,
      email,
      phoneNumber,
      positionApplied,
      department,
      dateOfBirth,
      joiningDate,
      employmentType,
      emergencyContact,
      residentialAddress,
      photo: {
        data: ph,
        date: new Date(),
      },
    });

    await employee.save();
    return res
      .status(201)
      .json({ message: "Employee created successfully", employee });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const searchEmployees = async (req, res) => {
  const allowedFields = ["fullName", "positionApplied", "department"];
  const query = {};

  // Add only the allowed fields to the query object
  allowedFields.forEach((field) => {
    if (req.query[field]) {
      query[field] = { $regex: new RegExp(req.query[field], "i") };
    }
  });

  // Check if query object is empty (no search criteria)
  if (Object.keys(query).length === 0) {
    return res.status(400).json({
      message:
        "Please provide at least one search criterion (name, designation, or department)",
    });
  }

  try {
    const employees = await Employee.find(query);

    if (!employees.length) {
      return res.status(404).json({ message: "No employees found" });
    }

    return res.status(200).json({ message: "Found employees", employees });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error searching for employees", error });
  }
};

// View profile for an employee
const viewProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res
      .status(201)
      .json({ message: "Retrieved employee profile", employee });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving employee profile", error });
  }
};

const uploadDocuments = async (req, res) => {
  const { id } = req.params;
  const files = req.files; // Expecting multiple files with specific field names

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Define the document fields in the schema
    const documentFields = [
      "cv",
      "relievingLetter",
      "bankDetails",
      "aadharCard",
      "postalAddress",
      "permanentAddress",
      "photo",
    ];

    // Update document fields if a file is provided for them
    documentFields.forEach((field) => {
      if (files[field]) {
        employee[field] = {
          data: files[field][0].path, // Set file path
          date: new Date(), // Set upload date
        };
      }
    });

    // Check if all required fields are now available
    const allFieldsAvailable = documentFields.every(
      (field) => employee[field]?.data
    );

    // Set documentsSubmitted to true if all fields are present
    if (allFieldsAvailable) {
      employee.documentsSubmitted = true;
    }

    await employee.save();
    return res.status(201).json({
      message: "Files uploaded successfully",
      documentsSubmitted: employee.documentsSubmitted,
      employee,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error uploading files", error });
  }
};

//get all candidate names
//change to query
const getCandidateName = async (req, res) => {
  const { department } = req.query;
  try {
    const employees = await Employee.find(
      { department: department },
      { fullName: 1, _id: 0 }
    );
    if (employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found in this department" });
    }

    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching employees",
      error: error.message,
    });
  }
};

//get candidate data on basis of fullName and department
const getCandidate = async (req, res) => {
  try {
    const employee = await Employee.findOne(req.query);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.status(200).json(employee);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    return res
      .status(201)
      .json({ message: "Retrieved all employees", employees });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving employees", error });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the employee by ID
    const user = await Employee.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const documentFields = {
      photo: {
        photo: user.photo.data,
        date: user.photo.date,
      },
      cv: {
        cv: user.cv.data,
        date: user.cv.date,
      },
      relievingLetter: {
        relievingLetter: user.relievingLetter.data,
        date: user.relievingLetter.date,
      },
      bankDetails: {
        bankDetails: user.bankDetails.data,
        date: user.bankDetails.date,
      },
      aadharCard: {
        aadharCard: user.aadharCard.data,
        date: user.aadharCard.date,
      },
      postalAddress: {
        postalAddress: user.postalAddress.data,
        date: user.postalAddress.date,
      },
      permanentAddress: {
        permanentAddress: user.permanentAddress.data,
        date: user.permanentAddress.date,
      },
    };

    return res.status(200).json({ documents: documentFields });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getCandidateDepartment = async (req, res) => {
  try {
    // Using the distinct method to get unique department names
    const departments = await Employee.distinct("department");
    return res.status(200).json(departments);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching department names",
      error: error.message,
    });
  }
};

const updateCandidateData = async (req, res) => {
  const { id } = req.params;
  const {
    offerAcceptance,
    backgroundCheck,
    trainingSchedule,
    itSetup,
    finalReview,
    documentsSubmitted,
  } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (offerAcceptance !== undefined)
      employee.offerAcceptance = !employee.offerAcceptance;
    if (backgroundCheck !== undefined)
      employee.backgroundCheck = !employee.backgroundCheck;
    if (trainingSchedule !== undefined)
      employee.trainingSchedule = !employee.trainingSchedule;
    if (itSetup !== undefined) employee.itSetup = !employee.itSetup;
    if (finalReview !== undefined) employee.finalReview = !employee.finalReview;
    if (documentsSubmitted !== undefined)
      employee.documentsSubmitted = !employee.documentsSubmitted;

    // Save the updated employee document to the database
    await employee.save();

    return res.status(200).json({
      message: "Employee data updated successfully",
      employee,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getAllDepartment = async (req, res) => {
  try {
    // Use distinct method to get unique department names from Employee collection
    const departments = [
      "Human Resources",
      "Finance",
      "Marketing",
      "Sales",
      "Operations",
      "Information Technology",
      "Customer Service",
      "Research and Development (R&D)",
      "Legal",
      "Software Development",
    ];
    return res.status(200).json({ departments: departments });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching department names",
      error: error.message,
    });
  }
};

const getEmployeetype = async (req, res) => {
  try {
    // Use distinct method to get unique department names from Employee collection
    const employeetype = ["Internship", "Contract", "Full time", "Part time"];
    return res.status(200).json({ employeetype: employeetype });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching employee types",
      error: error.message,
    });
  }
};

const getPositiontype = async (req, res) => {
  try {
    // Hardcoded array of position types
    const positiontypes = [
      "Software Developer",
      "Research and Development (R&D)",
      "Human Resources",
    ];

    // Return the position types as a JSON response
    return res.status(200).json({ positiontypes });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching employee types",
      error: error.message,
    });
  }
};

const sendMail = async (req, res) => {
  try {
    const { email, emailBody, subject } = req.body;

    // Validate the email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the employee with the given email
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set up the email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Environment variable for email
        pass: process.env.EMAIL_PASSWORD, // Environment variable for password or app password
      },
    });

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: emailBody,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Email has been sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err.message);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const viewNotUploadedDocuments = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const missingDocuments = [];

    // Check for missing documents
    if (!employee.photo.data) missingDocuments.push("Photo");
    if (!employee.cv.data) missingDocuments.push("CV");
    if (!employee.relievingLetter.data)
      missingDocuments.push("Relieving Letter");
    if (!employee.bankDetails.data) missingDocuments.push("Bank Details");
    if (!employee.aadharCard.data) missingDocuments.push("Aadhar Card");
    if (!employee.postalAddress.data) missingDocuments.push("Postal Address");
    if (!employee.permanentAddress.data)
      missingDocuments.push("Permanent Address");

    if (missingDocuments.length > 0) {
      return res.status(200).json({
        missingDocuments,
      });
    }

    return res.status(200).json({ message: "All documents are available." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

<<<<<<< HEAD

const getEmployeePercentage = async (req, res) => {
  try {
    const previousMonthStart = moment().subtract(1, "month").startOf("month").toDate();
    const previousMonthEnd = moment().subtract(1, "month").endOf("month").toDate();
    const currentMonthStart = moment().startOf("month").toDate();
    const currentMonthEnd = moment().endOf("month").toDate();

    const previousMonthCount = await Employee.countDocuments({
      createdAt: { $gte: previousMonthStart, $lte: previousMonthEnd },
    });
    

  
    const currentMonthCount = await Employee.countDocuments({
      createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd },
    });
    let percentageChange = 0;
    if (previousMonthCount > 0) {
    
      percentageChange = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
    } else {
      
      percentageChange = currentMonthCount > 0 ? 100 : 0; 
    }

    if( percentageChange > 100 ){
      percentageChange = 100;
    }
    if (percentageChange < -100){
      percentageChange = -100;
    }
    const NewEmployee = Math.abs(previousMonthCount - currentMonthCount);
    
    return res.json({
      percentageChange,
      NewEmployee
=======
const getEmployeeCountForCurrentMonth = async (req, res) => {
  try {
    const currentMonthStart = moment().startOf("month").toDate();
    const currentMonthEnd = moment().endOf("month").toDate();

    const currentMonthCount = await Employee.countDocuments({
      createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd },
    });

    return res.json({
      empCount: currentMonthCount,
>>>>>>> 34064bb5fc769ca3d91f45994754b4c5c8d304a2
    });
  } catch (error) {
    console.error("Error calculating employee percentage:", error);
    return res.status(500).json({ message: error.message });
  }
};

<<<<<<< HEAD
=======
const getStates = async (req, res) => {
  try {
    const states = State.getStatesOfCountry('IN').map((state) => ({
      name: state.name,
      isoCode: state.isoCode,
    }));

    return res.status(200).json({
      success: true,
      data: states,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCities = async (req, res) => {
  try {
    const { stateCode } = req.query;

    if (!stateCode) {
      return res.status(400).json({
        success: false,
        message: "State code is required",
      });
    }

    const cities = City.getCitiesOfState('IN', stateCode).map(
      (city) => ({
        name: city.name,
      })
    );

    return res.status(200).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
>>>>>>> 34064bb5fc769ca3d91f45994754b4c5c8d304a2


module.exports = {
  addNewCandidate,
  getCandidateName,
  getCandidateDepartment,
  searchEmployees,
  uploadDocuments,
  getAllEmployees,
  viewProfile,
  getCandidate,
  getAllDocuments,
  updateCandidateData,
  getAllDepartment,
  getEmployeetype,
  getPositiontype,
  sendMail,
  viewNotUploadedDocuments,
<<<<<<< HEAD
  getEmployeePercentage
=======
  getEmployeeCountForCurrentMonth,
  getStates,
  getCities

};
const updateExpense = async (req, res) => {
  const { emp, amount, billNumber, description, receiverName, receiverNumber, purpose, date } = req.body;
  const { expenseCategory } = req.query;

  // Validate expenseCategory
  const validCategories = ["Travel", "Food", "Gifts", "Stationary", "Other"];
  if (!validCategories.includes(expenseCategory)) {
    return res.status(400).json({ message: "Invalid expense category" });
  }

  try {
    // Fetch the expense for the specified employee and category
    const expense = await Expense.findOne({ emp, expenseCategory });
    if (!expense) {
      return res.status(404).json({ error: "Expense not found for the specified employee and category" });
    }

    // Dynamically update the category fields
    if (expenseCategory === "Other") {
      if (!expense.other) expense.other = {};  // Initialize 'other' field if not already present
      expense.other.date = date || expense.other.date;
      expense.other.amount = expense.other.amount || {};
      expense.other.amount.cash = amount?.cash || expense.other.amount.cash;
      expense.other.amount.online = amount?.online || expense.other.amount.online;
      expense.other.billNumber = billNumber || expense.other.billNumber;
      expense.other.description = description || expense.other.description;
      expense.other.receipts = req.file ? req.file.path : expense.other.receipts;
    }

    if (expenseCategory === "Gifts") {
      if (!expense.gifts) expense.gifts = {};  // Initialize 'gifts' field if not already present
      expense.gifts.date = date || expense.gifts.date;
      expense.gifts.amount = expense.gifts.amount || {};
      expense.gifts.amount.cash = amount?.cash || expense.gifts.amount.cash;
      expense.gifts.amount.online = amount?.online || expense.gifts.amount.online;
      expense.gifts.billNumber = billNumber || expense.gifts.billNumber;
      expense.gifts.description = description || expense.gifts.description;
      expense.gifts.receiverName = receiverName || expense.gifts.receiverName;
      expense.gifts.receiverNumber = receiverNumber || expense.gifts.receiverNumber;
      expense.gifts.purpose = purpose || expense.gifts.purpose;
      expense.gifts.receipts = req.file ? req.file.path : expense.gifts.receipts;
    }

    if (expenseCategory === "Stationary") {
      if (!expense.stationary) expense.stationary = {};  // Initialize 'stationary' field if not already present
      expense.stationary.date = date || expense.stationary.date;
      expense.stationary.amount = expense.stationary.amount || {};
      expense.stationary.amount.cash = amount?.cash || expense.stationary.amount.cash;
      expense.stationary.amount.online = amount?.online || expense.stationary.amount.online;
      expense.stationary.billNumber = billNumber || expense.stationary.billNumber;
      expense.stationary.description = description || expense.stationary.description;
      expense.stationary.receipts = req.file ? req.file.path : expense.stationary.receipts;
    }

    // Save the updated expense document
    await expense.save();
    return res.status(200).json({ message: `${expenseCategory} expense updated successfully`, data: expense });
  } catch (error) {
    console.error("Error updating expense:", error);
    return res.status(500).json({ error: "Server error", message: error.message });
  }
};





*/