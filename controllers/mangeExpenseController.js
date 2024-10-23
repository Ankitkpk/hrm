const Expense = require("../models/mangeExpenseModel");

// Controller to handle POST request and save the expense with manageExpenseFor fixed as 'Sales'
const createExpenseForSales = async (req, res) => {
  const manageExpenseFor = "Sales"; // Fixed value "Sales"
  const emp = req.params.id;
 
  try {
    const {
      hq,
      name,
      purpose,
      amount, // Default value "Pending" if not provided
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

    if (
      !hq ||
      !name ||
      !purpose ||
      !amount ||
      !dateOfJoining ||
      !totalNoOfWorkingDays ||
      !totalHQWorkingDays ||
      !totalNoOfOutstationDays ||
      !day ||
      !date ||
      !customerHospitalNameVisited ||
      !city ||
      !fromTo ||
      !fromAreaName ||
      !modeOfTransport ||
      !workingRemark
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // Get the uploaded file's path
    const attachReceipt = req.file ? req.file.path : null;

    // Create a new expense document
    const newExpense = new Expense({
      manageExpenseFor, // Assign fixed value
      hq,
      name,
      purpose,
      amount,
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
      emp,
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
    return res.status(400).json({ message: "Error saving expense", error });
  }
};



const getExpensesByQuery = async (req, res) => {
  try {
    const {status} = req.query;

    // Find expenses based on the filter
    const expenses = await Expense.find({$and:[
      req.query,
      {isDeleted:false}
    ]}).select('date purpose amount status');

    // const expenses = await Expense.find(req.query,{ isDeleted: false })

    // Return the filtered expenses
    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ error: "Server error", message: error.message });
  }
};


const getExpenseDetails = async (req, res) => {
  try {
    const id = req.params.id; // Get the id from request params
    const data = await Expense.findById(id).select('date purpose amount status attachReceipt');
    
    if (!data) {
      return res.status(404).json({ message: "Id not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};


const deleteExpense = async (req,res)=>{
  try{
const id = req.params.id;
const deleteExpense = await Expense.findByIdAndDelete(id);
if(!deleteExpense){
  res.json({message:"Id not found"});

}
return res.status(200).json({message:"Expense Deleted Successfully"})
  }catch(error){
    return res.status(500).json({ error: "Server error" });
  }
}


const updateExpenseForSales = async (req, res) => {
  const { id } = req.params; // ID of the expense to update

  try {
    // Get the uploaded file path, if any
    const attachReceipt = req.file ? req.file.path : null;

    // Build the update object dynamically
    const updateData = { ...req.body };
    if (attachReceipt) updateData.attachReceipt = attachReceipt;

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    // Find and update the expense by ID
    const updatedExpense = await Expense.findByIdAndUpdate(id, updateData, { new: true });

    // If no expense found, return 404
    if (!updatedExpense) return res.status(404).json({ message: "Expense not found" });

    // Return the updated expense
    return res.status(200).json(updatedExpense);
  } catch (error) {
    return res.status(500).json({ message: "Error updating expense", error });
  }
};

const updateExpenseForScreening = async (req, res) => {
  const { id } = req.params; // ID of the expense to update

  try {
    // Get the uploaded file path, if any
    const attachReceipt = req.file ? req.file.path : null;

    // Build the update object dynamically
    const updateData = { ...req.body };
    if (attachReceipt) updateData.attachReceipt = attachReceipt;

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    // Find and update the expense by ID
    const updatedExpense = await Expense.findByIdAndUpdate(id, updateData, { new: true });

    // If no expense found, return 404
    if (!updatedExpense) return res.status(404).json({ message: "Expense not found" });

    // Return the updated expense
    return res.status(200).json(updatedExpense);
  } catch (error) {
    return res.status(500).json({ message: "Error updating expense", error });
  }
};



module.exports = {
  createExpenseForSales,
  createExpenseForScreening,
  getExpensesByQuery,
  getExpenseDetails,
  deleteExpense,
  updateExpenseForSales,
  updateExpenseForScreening
};
