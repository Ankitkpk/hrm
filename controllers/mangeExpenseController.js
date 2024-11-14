 const Expense = require("../models/mangeExpenseModel");

// // Controller to handle POST request and save the expense with manageExpenseFor fixed as 'Sales'
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

//     // Get the uploaded file's path
//     const attachReceipt = req.file ? req.file.path : null;

//     // Create a new expense document
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

//     // Save to the database
      const savedExpense = await newExpense.save();
      return res.status(201).json(savedExpense);
    } catch (error) {
      return res.status(500).json({ message: "Error saving expense", error });
    }
  };
// // Controller to handle POST request and save the expense with manageExpenseFor fixed as 'Screening'
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

//     // Create a new expense document
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

//     // Save to the database
      const savedExpense = await newExpense.save();
      return res.status(201).json(savedExpense);
    } catch (error) {
      return res.status(400).json({ message: "Error saving expense", error });
    }
  };



  const getExpensesByQuery = async (req, res) => {
    try {
      const { status } = req.query;
  
      // Find expenses based on the filter
      const expenses = await Expense.find({
        $and: [
          req.query,
          { isDeleted: false }
        ]
      }).select('date purpose amount status');
  
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
      console.log(data);
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
//     // Get the uploaded file path, if any
      const attachReceipt = req.file ? req.file.path : null;

//     // Build the update object dynamically
      const updateData = { ...req.body };
      if (attachReceipt) updateData.attachReceipt = attachReceipt;

//     // Check if there are any fields to update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No fields provided to update" });
      }

//     // Find and update the expense by ID
      const updatedExpense = await Expense.findByIdAndUpdate(id, updateData, { new: true });

//     // If no expense found, return 404
      if (!updatedExpense) return res.status(404).json({ message: "Expense not found" });

//     // Return the updated expense
      return res.status(200).json(updatedExpense);
    } catch (error) {
     return res.status(500).json({ message: "Error updating expense", error });
    }
  };

  const updateExpenseForScreening = async (req, res) => {
    const { id } = req.params; // ID of the expense to update

    try {
//     // Get the uploaded file path, if any 
     const attachReceipt = req.file ? req.file.path : null;

//     // Build the update object dynamically
      const updateData = { ...req.body };
      if (attachReceipt) updateData.attachReceipt = attachReceipt;

//     // Check if there are any fields to update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No fields provided to update" });
      }

//     // Find and update the expense by ID
     const updatedExpense = await Expense.findByIdAndUpdate(id, updateData, { new: true });

      // If no expense found, return 404 
     if (!updatedExpense) return res.status(404).json({ message: "Expense not found" });

      // Return the updated expense
      return res.status(200).json(updatedExpense);
    } catch (error) {
     return res.status(500).json({ message: "Error updating expense", error });
   }
  };

  const manageExpenseForGifts = async (req, res) => {
    try {
      const {
        employeeId,
        name,
        place,
        date,
        amount,
        billNumber,
        description,
        receiverName,
        receiverNumber,
        purpose,
      } = req.body;
  
      // Validate required fields
      if (!name || !place || !date || !employeeId) {
        return res.status(400).json({
          success: false,
          message: "Name, place, date and employeeId are required"
        });
      }
      
      // Validate date format
      const expenseDate = new Date(date);
      if (isNaN(expenseDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format"
        });
      }
  
      // Get the month for the expense record
      const month = expenseDate.toLocaleString('default', { month: 'long' }) + ' ' + expenseDate.getFullYear();
  
      // Define the gift expense object
      const giftsExpense = {
        date: expenseDate,
        amount: amount || { cash: 0, online: 0 },
        billNumber,
        description,
        receiverName,
        receiverNumber,
        purpose,
        receipt: req.file ? req.file.path : null,
        status: "pending"
      };
  
      // Define start and end of the day
      const startOfDay = new Date(expenseDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(expenseDate);
      endOfDay.setHours(23, 59, 59, 999);
  
      // Find existing expense entry for the employee
      let expense = await Expense.findOne({
        employeeId,
        place,
        month
      });
  
      // If expense exists, update daily expenses
      if (expense) {
        let dayExpense = expense.dailyExpenses.find(day => 
          new Date(day.date) >= startOfDay && new Date(day.date) <= endOfDay
        );
        if (dayExpense) {
          dayExpense.gifts.push(giftsExpense); // Add the gift expense to the existing day
        } else {
          expense.dailyExpenses.push({
            date: expenseDate,
            gifts: [giftsExpense] // Add a new entry for the day if it doesn't exist
          });
        }
      } else {
        // If no expense record, create a new one
        expense = new Expense({
          name,
          employeeId,
          place,
          month,
          dailyExpenses: [{
            date: expenseDate,
            gifts: [giftsExpense]
          }]
        });
      }
  
      // Sort daily expenses by date
      expense.dailyExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
  
      // Save the expense record
      await expense.save();
  
      res.status(200).json({ message: "Gift expense saved successfully", data: expense });
    } catch (error) {
      console.error("Error saving gift expense:", error);
      res.status(500).json({ message: error.message });
    }
  };
  
  const manageExpenseForStationary = async (req, res) => {
    try {
      const {
        employeeId,
        name,
        place,
        date,
        amount,
        billNumber,
        description,
        itemName,
        quantity,
        purpose
      } = req.body;
  
      // Validate required fields
      if (!name || !place || !date || !employeeId) {
        return res.status(400).json({
          success: false,
          message: "Name, place, date, and employeeId are required"
        });
      }
  
      // Validate date format
      const expenseDate = new Date(date);
      if (isNaN(expenseDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format"
        });
      }
  
      // Generate month string from date
      const month = expenseDate.toLocaleString('default', { month: 'long' }) + ' ' + expenseDate.getFullYear();
  
      // Define the stationary expense object
      const stationaryExpense = {
        date: expenseDate,
        amount: amount || { cash: 0, online: 0 },
        billNumber,
        description,
        itemName,
        quantity,
        purpose,
        receipt: req.file ? req.file.path : null,
        status: "pending"
      };
  
      // Define start and end of the day for date comparison
      const startOfDay = new Date(expenseDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(expenseDate);
      endOfDay.setHours(23, 59, 59, 999);
  
      // Find existing expense entry for the employee
      let expense = await Expense.findOne({
        employeeId,
        place,
        month
      });
  
      // If expense exists, update daily expenses
      if (expense) {
        let dayExpense = expense.dailyExpenses.find(day => 
          new Date(day.date) >= startOfDay && new Date(day.date) <= endOfDay
        );
        if (dayExpense) {
          dayExpense.stationeries.push(stationaryExpense); // Add the stationery expense to the existing day
        } else {
          expense.dailyExpenses.push({
            date: expenseDate,
            stationeries: [stationaryExpense] // Add a new entry for the day if it doesn't exist
          });
        }
      } else {
        // If no expense record, create a new one
        expense = new Expense({
          name,
          employeeId,
          place,
          month,
          dailyExpenses: [{
            date: expenseDate,
            stationeries: [stationaryExpense]
          }]
        });
      }
  
      // Sort daily expenses by date
      expense.dailyExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
  
      // Save the expense record
      await expense.save();
  
      res.status(200).json({ success: true, message: "Stationery expense saved successfully", data: expense });
    } catch (error) {
      console.error("Error saving stationery expense:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  


  const manageExpenseForOther = async (req, res) => {
    try {
      const {
        employeeId,
        name,
        place,
        date,
        amount,
        billNumber,
        description,
      } = req.body;
  
      // Validate required fields
      if (!name || !place || !date || !employeeId) {
        return res.status(400).json({
          success: false,
          message: "Name, place, date, and employeeId are required"
        });
      }
  
      // Validate date format
      const expenseDate = new Date(date);
      if (isNaN(expenseDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format"
        });
      }
  
      // Get the month for the expense record
      const month = expenseDate.toLocaleString('default', { month: 'long' }) + ' ' + expenseDate.getFullYear();
  
      // Define the other expense object
      const otherExpense = {
        date: expenseDate,
        amount: amount || { cash: 0, online: 0 },
        billNumber,
        description,
        receipt: req.file ? req.file.path : null,
      };
  
      // Define start and end of the day
      const startOfDay = new Date(expenseDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(expenseDate);
      endOfDay.setHours(23, 59, 59, 999);
  
      // Find existing expense entry for the employee
      let expense = await Expense.findOne({
        employeeId,
        place,
        month
      });
  
      // If expense exists, update daily expenses
      if (expense) {
        let dayExpense = expense.dailyExpenses.find(day => 
          new Date(day.date) >= startOfDay && new Date(day.date) <= endOfDay
        );
        if (dayExpense) {
          dayExpense.others.push(otherExpense); // Add the other expense to the existing day
        } else {
          expense.dailyExpenses.push({
            date: expenseDate,
            others: [otherExpense] // Add a new entry for the day if it doesn't exist
          });
        }
      } else {
        // If no expense record, create a new one
        expense = new Expense({
          name,
          employeeId,
          place,
          month,
          dailyExpenses: [{
            date: expenseDate,
            others: [otherExpense]
          }]
        });
      }
  
      // Sort daily expenses by date
      expense.dailyExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
  
      // Save the expense record
      await expense.save();
  
      res.status(200).json({ message: "Other expense saved successfully", data: expense });
    } catch (error) {
      console.error("Error saving other expense:", error);
      res.status(500).json({ message: error.message });
    }
  };
  
  
  const getExpenseHistory = async (req, res) => {
    try {
      // Fetch expenses where isDeleted is false and select specific fields, including amounts for each category
      const expenses = await Expense.find({}).select("dailyExpenses status");
  
      const expenseHistory = expenses.map((expense) => {
        let date = null;
        let purpose = "";
        let amount = 0;
  
        // Iterate through dailyExpenses and each category inside dailyExpenses
        expense.dailyExpenses.forEach((dailyExpense) => {
          // Check each category array inside dailyExpense
          ['travels', 'foods', 'gifts', 'stationeries', 'others'].forEach((category) => {
            dailyExpense[category].forEach((item) => {
              // Only process items with a valid date
              if (item.date) {
                date = item.date;
                switch (category) {
                  case 'gifts':
                    purpose = item.purpose || "";
                    amount = (item.amount?.cash || 0) + (item.amount?.online || 0);
                    break;
                  case 'stationeries':
                    purpose = item.description || "";
                    amount = (item.amount?.cash || 0) + (item.amount?.online || 0);
                    break;
                  case 'others':
                    purpose = item.description || "";
                    amount = (item.amount?.cash || 0) + (item.amount?.online || 0);
                    break;
                  case 'travels':
                    purpose = item.workingRemark || "";
                    amount = (item.amount?.cash || 0) + (item.amount?.online || 0);
                    break;
                  case 'foods':
                    purpose = item.remarks || "";
                    amount = (item.amount?.cash || 0) + (item.amount?.online || 0);
                    break;
                }
              }
            });
          });
        });
  
        return {
          date,
          purpose,
          amount,
          status: expense.status,
        };
      });
  
      const totalExpense = expenseHistory.reduce((accumulator, item) => {
        return accumulator + item.amount;
      }, 0);
  
      console.log(totalExpense);
      return res.status(200).json({ expenseHistory, totalExpense });
    } catch (error) {
      console.error("Error fetching expense history:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  module.exports = {
    createExpenseForSales,
    createExpenseForScreening,
    getExpensesByQuery,
    getExpenseDetails,
    deleteExpense,
    updateExpenseForSales,
    updateExpenseForScreening,
    manageExpenseForGifts,
    manageExpenseForStationary,
    manageExpenseForOther,
    getExpenseHistory,
    

    
 };
