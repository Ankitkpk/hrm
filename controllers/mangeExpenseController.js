const Expense = require("../models/mangeExpenseModel");

// Controller to handle POST request and save the expense with manageExpenseFor fixed as 'Sales'
const createExpenseForSales = async (req, res) => {
  const manageExpenseFor = "Sales"; // Fixed value "Sales"
  const emp = req.params.id;
  try {
    const {
      hq,
      name,
      dateOfJoining,
      totalNoOfWorkingDays,
      totalHQWorkingDays,
      totalNoOfOutstationDays,
      day,
      date,
      customerHospitalNameVisited,
      city,
      fromTo,
      fromAreaName,
      modeOfTransport,
      workingRemark,
    } = req.body;
    if (!hq || !name || !dateOfJoining || !totalNoOfWorkingDays || !totalHQWorkingDays || 
      !totalNoOfOutstationDays || !day || !date || 
      !customerHospitalNameVisited || !city || !fromTo || 
      !fromAreaName || !modeOfTransport || !workingRemark) {
    return res.status(400).json({
      message: "All required fields must be provided"})
    }
    // Get the uploaded file's path
    const attachReceipt = req.file ? req.file.path : null;

    // Create a new expense document
    const newExpense = new Expense({
      manageExpenseFor, // Assign fixed value
      hq,
      name,
      dateOfJoining,
      totalNoOfWorkingDays,
      totalHQWorkingDays,
      totalNoOfOutstationDays,
      day,
      date,
      customerHospitalNameVisited,
      city,
      fromTo,
      fromAreaName,
      modeOfTransport,
      attachReceipt, // Save the uploaded file's path
      workingRemark,
      emp
    });

    // Save to the database
    const savedExpense = await newExpense.save();
    return res.status(201).json(savedExpense);
  } catch (error) {
    return res.status(500).json({ message: "Error saving expense", error });
  }
};

// Controller to handle POST request and save the expense with manageExpenseFor fixed as 'Screening'
const createExpenseForScreening = async (req, res) => {
  const manageExpenseFor = "Screening"; // Fixed value "Screening"
  const emp = req.params.id;
  try {
    const {
      name,
      purpose,
      dateOfSubmission,
      lastDateOfSubmission,
      location,
      department,
      manager,
      payPeriodFrom,
    } = req.body;


    if (!name || !purpose || !dateOfSubmission || !lastDateOfSubmission || !location || !department || !manager || !payPeriodFrom) {
      return res.status(400).json({message: "All required fields must be provided"});
    }
    // Get the uploaded file's path
    const attachReceipt = req.file ? req.file.path : null;

    // Create a new expense document
    const newExpense = new Expense({
      manageExpenseFor, // Assign fixed value
      name,
      purpose,
      dateOfSubmission,
      lastDateOfSubmission,
      location,
      department,
      manager,
      payPeriodFrom,
      attachReceipt, // Save the uploaded file's path
      emp
    });

    // Save to the database
    const savedExpense = await newExpense.save();
    return res.status(201).json(savedExpense);
  } catch (error) {
    return res.status(500).json({ message: "Error saving expense", error });
  }
};

module.exports = {
  createExpenseForSales,
  createExpenseForScreening,
};
