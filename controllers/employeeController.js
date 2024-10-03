const Employee = require("../models/Employee");

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
    const ph = photo[0].originalname;

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
      photo: ph,
    });

    await employee.save();
    return res
      .status(201)
      .json({ message: "Employee created successfully", employee });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// add reeturn for all apis
// Search employees
// const searchEmployees = async (req, res) => {
//   const { name, designation, department } = req.query;

//   if (!name && !designation && !department) {
//     return res.status(400).json({
//       message:
//         "Please provide at least one search criterion (name, designation, or department)",
//     });
//   }

//   try {
//     const employees = await Employee.find({
//       $or: [
//         name && { fullName: { $regex: new RegExp(name, "i") } },
//         designation && {
//           positionApplied: { $regex: new RegExp(designation, "i") },
//         },
//         department && { department: { $regex: new RegExp(department, "i") } },
//       ].filter(Boolean),
//     });
//     //check this one
//     // const employees = await Employee.find({
//     //     req.query
//     // })

//     if (!employees.length) {
//       return res.status(404).json({ message: "No employees found" });
//     }
//     //add status code

//     return res.status(201).json({ message: "Found employee", employees });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Error searching for employees", error });
//   }
// };
const searchEmployees = async (req, res) => {
    const allowedFields = ['fullName', 'positionApplied', 'department'];
    const query = {};
  
    // Add only the allowed fields to the query object
    allowedFields.forEach((field) => {
      if (req.query[field]) {
        query[field] = { $regex: new RegExp(req.query[field], 'i') };
      }
    });
  
    // Check if query object is empty (no search criteria)
    if (Object.keys(query).length === 0) {
      return res.status(400).json({
        message: 'Please provide at least one search criterion (name, designation, or department)',
      });
    }
  
    try {
      const employees = await Employee.find(query);
  
      if (!employees.length) {
        return res.status(404).json({ message: 'No employees found' });
      }
  
      return res.status(200).json({ message: 'Found employees', employees });
    } catch (error) {
      return res.status(500).json({ message: 'Error searching for employees', error });
    }
  };
  
// View profile for an employee
//look for modification
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

// Upload documents for an employee
const uploadDocuments = async (req, res) => {
  const { id } = req.params;
  const { fileType } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const document = {
      filePath: req.file.path,
      fileType: fileType,
    };

    employee.documents.push(document);
    await employee.save();

    return res
      .status(201)
      .json({ message: "File uploaded successfully", employee });
  } catch (error) {
    return res.status(500).json({ message: "Error uploading file", error });
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

module.exports = {
addNewCandidate,
  searchEmployees,
  uploadDocuments,
  getAllEmployees,
  viewProfile,
};
