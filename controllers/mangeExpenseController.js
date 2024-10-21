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
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: "Error saving expense", error });
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
      departmant,
      manager,
      payPeriodFrom,
    } = req.body;

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
      departmant,
      manager,
      payPeriodFrom,
      attachReceipt, // Save the uploaded file's path
      emp
    });

    // Save to the database
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: "Error saving expense", error });
  }
};

module.exports = {
  createExpenseForSales,
  createExpenseForScreening,
};
