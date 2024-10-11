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
      photo:{
        data:ph,
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
          data: files[field][0].path,  // Set file path
          date: new Date(),            // Set upload date
        };
      }
    });

    // Check if all required fields are now available
    const allFieldsAvailable = documentFields.every((field) => employee[field]?.data);

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
const getCandidateName = async (req, res) => {
  try {
    const getName = await Employee.find({}).select("fullName");
    res.status(200).json(getName);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching candidate names",
        error: error.message,
      });
  }
};

//get candidate data on basis of fullName and department
const getCandidate = async (req, res) => {
  const { fullName,email, department } = req.query;
  try {
    const employee = await Employee.findOne({ fullName, department,email });

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


// include with 
const checkAllFields = async (req, res) => {
  try {
    const { id } = req.params; // Use 'id' instead of 'userId'

    // Find user by ID
    const user = await Employee.findById(id); // Assuming the model is 'Employee' as per your other functions

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if all required fields are available
    const allFieldsAvailable =
      user.photo.data &&
      user.cv.data &&
      user.relievingLetter.data &&
      user.bankDetails.data &&
      user.aadharCard.data &&
      user.postalAddress.data &&
      user.permanentAddress.data;

    return res.status(200).json({ allFieldsAvailable: !!allFieldsAvailable });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
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
      photo:{
         photo:user.photo.data,
         date:user.photo.date
       },
       cv:{
         cv:user.cv.data,
         date:user.date
       },
       relievingLetter:{
         relievingLetter:user.relievingLetter.data,
         date:user.relievingLetter.date
       },
       bankDetails: {
         bankDetails:user.bankDetails.data,
         date:user.bankDetails.date
       },
       aadharCard:{
         aadharCard:user.aadharCard.data,
         date:user.aadharCard.date
       },
        
       postalAddress:{
         postalAddress:user.postalAddress.data,
         date:user.postalAddress.date
       },
        
       permanentAddress:{
         permanentAddress:user. permanentAddress.data,
         date: user.permanentAddress.date
       }
     };
  
  
    return res.status(200).json({ documents: documentFields });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

//pending - view document, onboarding workflow half done

module.exports = {
  addNewCandidate,
  getCandidateName,
  searchEmployees,
  uploadDocuments,
  getAllEmployees,
  viewProfile,
  getCandidate,
  checkAllFields,
  getAllDocuments
};
