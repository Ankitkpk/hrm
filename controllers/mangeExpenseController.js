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
        place,
        date,
        amount, 
        billNumber,
        description,
        receiverName,
        receiverNumber,
        purpose,
      } = req.body;
  
      
      const { expenseCategory } = req.query;
      
      const validCategories = ["Travel", "Food", "Gifts", "Stationary", "Other"];
      if (!validCategories.includes(expenseCategory)) {
        return res.status(400).json({ message: "Invalid expense category" });
      }
  
      
      let expenseData = {
        employeeId,
        expenseCategory,
        place,
      };
  
      
      if (expenseCategory === "Gifts") {
        expenseData.gifts = {
          date,
          amount: amount || { cash: 0, online: 0 }, 
          billNumber,
          description,
          receiverName,
          receiverNumber,
          purpose,
          receipt: req.file ? req.file.path : null, 
        };
      }
  
      
      const newExpense = new Expense(expenseData);
      await newExpense.save();
  
      res.status(201).json({ message: "Gift expense saved successfully", data: newExpense });
    } catch (error) {
      console.error("Error saving expense:", error);
      res.status(500).json({ message: error.message });
    }
  };
  const manageExpenseForStationary = async (req, res) => {
    try {
      const {
        employeeId,
        place,
        date,
        amount, 
        billNumber,
        description,
      } = req.body;
  
  
      const { expenseCategory } = req.query;
  
    
      const validCategories = ["Travel", "Food", "Gifts", "Stationary", "Other"];
      if (!validCategories.includes(expenseCategory)) {
        return res.status(400).json({ message: "Invalid expense category" });
      }
  
      
      let expenseData = {
        employeeId,
        expenseCategory,
        place,
      };
  
    
      if (expenseCategory === "Stationary") {
        expenseData.stationary = {
          date,
          amount: amount || { cash: 0, online: 0 }, 
          billNumber,
          description,
          receipt: req.file ? req.file.path : null, 
        };
      }
  
      const newExpense = new Expense(expenseData);
      await newExpense.save();
  
      res.status(201).json({ message: "Stationary expense saved successfully", data: newExpense });
    } catch (error) {
      console.error("Error saving expense:", error);
      res.status(500).json({ message: error.message });
    }
  };
  
  const manageExpenseForOther = async (req, res) => {
    try {
      const {
        employeeId,
        place,
        date,
        amount,
        billNumber,
        description,
      } = req.body;
  
    
      const { expenseCategory } = req.query;
  
      
      const validCategories = ["Travel", "Food", "Gifts", "Stationary", "Other"];
      if (!validCategories.includes(expenseCategory)) {
        return res.status(400).json({ message: "Invalid expense category" });
      }  
  
      
      let expenseData = {
        employeeId,
        expenseCategory,
        place,
      };
  
      
      if (expenseCategory === "Other") {
        expenseData.other = {
          date,
          amount: amount || { cash: 0, online: 0 },
          billNumber,
          description,
          receipt: req.file ? req.file.path : null, 
        };
      }
  
    
      const newExpense = new Expense(expenseData);
      await newExpense.save();
  
      res.status(201).json({ message: "Other expense saved successfully", data: newExpense });
    } catch (error) {
      console.error("Error saving expense:", error);
      res.status(500).json({ message: error.message });
    }
  };

  
  const getExpenseHistory = async (req, res) => {
    try {
      // Fetch expenses where isDeleted is false and select specific fields, including amounts for each category
      const expenses = await Expense.find({ isDeleted: false })
        .select("travel food gifts stationary other status"); 
      
      const expenseHistory = expenses.map((expense) => {
        let date = null;
        let purpose = "";
        let amount = 0;      
        if (expense.gifts?.date) {
  
          date = expense.gifts.date;
          purpose = expense.gifts.purpose || ""; 
          
          amount = (expense.gifts.amount?.cash || 0) + (expense.gifts.amount?.online || 0);
        } else if (expense.stationary?.date) {
          date = expense.stationary.date;
          purpose = expense.stationary.purpose || "";  
         
          amount = (expense.stationary.amount?.cash || 0) + (expense.stationary.amount?.online || 0);
        } else if (expense.other?.date) {
       
          date = expense.other.date;
          purpose = expense.other.description || "";  
          amount = (expense.other.amount?.cash || 0) + (expense.other.amount?.online || 0);
        } else if (expense.travel?.date) {
          
          date = expense.travel.date;
          purpose = expense.travel.workingRemark || ""; 
          amount = (expense.travel.amount?.cash || 0) + (expense.travel.amount?.online || 0);
        } else if (expense.food?.date) {
          
          date = expense.food.date;
          purpose = expense.food.remarks || "";  
          amount = (expense.food.amount?.cash || 0) +(expense.food.amount?.online || 0);
        }
        return {
          date,
          purpose,
          amount, 
          status: expense.status,
        };
      });
      const totalExpense = expenseHistory.reduce((accumulator , item) => {
        return accumulator += item.amount;
      }, 0)
      console.log(totalExpense);
      return res.status(200).json({expenseHistory});
    } catch (error) {
      console.error("Error fetching expense history:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  const getExpenseCategory=(req, res) => {
    const Categories = ["Travel", "Food", "Gifts", "Stationary", "Other"];
    try {
      return res.status(200).json(Categories);
    } catch (error) {
      console.error("Error fetching expense categories:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
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
    getExpenseCategory

    
 };
