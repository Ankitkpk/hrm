const EducationDetails = require("../models/EducationDetailsModel");

const saveEducationDetails = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      programSelection,
      specialization,
      emailAddress,
      startingDate,
      address,
      endingDate,
      city,
      nomineeDetails,
      pincode,
      relation,
      degree,
      year,
      institute,
      grade,
      document,
      hrmEmployeeId, // Use correct name from model
    } = req.body;

    // Check if email already exists
    const existingRecord = await EducationDetails.findOne({ emailAddress });

    if (existingRecord) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email address.",
      });
    }

    // Create a new education details record
    const newEducationDetails = new EducationDetails({
      fullName,
      phoneNumber,
      programSelection,
      specialization,
      emailAddress,
      startingDate,
      address,
      endingDate,
      city,
      nomineeDetails,
      pincode,
      relation,
      degree,
      year,
      institute,
      grade,
      hrmEmployeeId, // Use correct field name
      document: req.file ? req.file.path : null, // Save file path if uploaded
    });

    // Save to database
    await newEducationDetails.save();

    res.status(201).json({
      message: "Education details saved successfully",
      data: newEducationDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving education details",
      error: error.message,
    });
  }
};

const getEducationDetails = async (req, res) => {
  const id = req.params.id
  try {
    const getData = await EducationDetails.find({hrmEmployeeId:id}).select(
      "degree year institute grade"
    );
    if(!getData){
      return res.status(404).json({ message: "Education Details not found" });
    }
   return res.status(200).json(getData);
  } catch (error) {
    res.status(500).json({
      message: "Error showing education details",
      error: error.message,
    });
  }
};

const deleteEducationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EducationDetails.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Education Details not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "EducationDetails deleted successfully" });
  } catch (error) {
    console.error("Error deleting EducationDetails:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update EducationDetails by ID
const updateEducationDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the route parameters
    const { grade, degree, institute, year } = req.body; // Destructure the fields from the request body

    if (!grade && !degree && !institute && !year) {
     return res.status(400).json({ message: "Enter fields first"});
    }
    // Find the record by ID
    const educationDetails = await EducationDetails.findById(id);

    if (!educationDetails) {
      return res.status(404).json({
        message: "EducationDetails not found",
      });
    }

    // Update the fields if they are provided
    if (grade) educationDetails.grade = grade;
    if (degree) educationDetails.degree = degree;
    if (institute) educationDetails.institute = institute;
    if (year) educationDetails.year = year;
    if (req.file) educationDetails.document = req.file.path; // Update document if uploaded

    // Save the updated document to the database
    await educationDetails.save();

    res.status(200).json({
      message: "EducationDetails updated successfully",
      data: educationDetails,
    });
  } catch (error) {
    console.error("Error updating EducationDetails:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const documentDetails = async(req,res)=>{
  const id = req.params.id;
 
  try{
    const data = await EducationDetails.findById(id).select('fullName programSelection updatedAt document');
    if(!data){
    return  res.json({message:"User not Exist"});
    }

    res.status(200).json(data);
  }catch(error){
    res.status(500).json({
      message: "Server error"
    })    
}}

const getDataForUpdate= async(req,res)=>{
  const id = req.params.id;
  try{
    const data = await EducationDetails.findById(id)
    res.status(200).json(data)
  }catch(error){
    res.status(500).json({message:'Server error',error:error.message})
  }
}

module.exports = {
  saveEducationDetails,
  getEducationDetails,
  deleteEducationDetails,
  updateEducationDetails,
  documentDetails,
  getDataForUpdate
};
