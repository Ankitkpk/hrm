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
    let ph;
    if(photo){

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

      // Define possible document fields in the schema
      const documentFields = ['cv', 'relievingLetter', 'bankDetails', 'aadharCard', 'postalAddress', 'permanentAddress', "photo"];
      
      // Loop through each expected document field and update if a new file is provided
      documentFields.forEach(field => {
          if (files[field]) { // Check if the file was uploaded for this field
              employee[field] = files[field][0].path; // Update the field with the file path
          }
      });

      await employee.save();
      return res.status(201).json({ message: "Files uploaded successfully", employee });
  } catch (error) {
      return res.status(500).json({ message: "Error uploading files", error });
  }
};


//get all candidate names
const getCandidateName = async (req, res) => {
  try {
    const getName = await Employee.find({}).select('fullName');
    res.status(200).json(getName);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidate names', error: error.message });
  }
};


//get candidate data on basis of fullName and department
const getCandidate = async (req, res) => {
  const { fullName, department } = req.query;   
  try {
    const employee = await Employee.findOne({ fullName, department });
   
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
  getCandidateName,
  searchEmployees,
  uploadDocuments,
  getAllEmployees,
  viewProfile,
  getCandidate
};
