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
    const expenseDate = new Date();
    const month = expenseDate.toLocaleString('default', { month: 'long' }) + ' ' + expenseDate.getFullYear();
    console.log(month);
    try {
      
      const expenses = await Expense.find({month:month}).select("dailyExpenses");
  
     
      const expenseHistory = expenses.flatMap((expense) => 
        expense.dailyExpenses.flatMap((dailyExpense) =>
          ['travels', 'foods', 'gifts', 'stationeries', 'others'].flatMap((category) =>
            dailyExpense[category].map((item) => {
                const amount = (item.amount?.cash || 0) + (item.amount?.online || 0);
                let status="";
                switch (category) {
                  case 'gifts':
                   
                     status=item.status || " ";
                    break;
                  case 'stationeries':
                   
                     status=item.status || " ";
                    break;
                  case 'others':
                   
                    status=item.status || " ";
                    break;
                  case 'travels':
                   
                    status=item.status || " ";
                    break;
                  case 'foods':
                   
                    status=item.status || " ";
                    break;
                }
  
              
                return {
                  id:item.id,
                  date: item.date,
                  category,
                  amount,
                  status
                };
              
              
            })
          )
        )
      );
  
     const totalExpense = expenseHistory.reduce((accumulator, item) => accumulator + item.amount, 0);
      return res.status(200).json({ expenseHistory, totalExpense });
    } catch (error) {
      console.error("Error fetching expense history:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }; 
  
 /*
  const getExpenseHistory = async (req, res) => {
    const expenseDate = new Date();
    const month = expenseDate.toLocaleString('default', { month: 'long' }) + ' ' + expenseDate.getFullYear();
    console.log(month);
    try {
      const expenses = await Expense.aggregate([
        // Filter documents within the specified month
        { 
          $match: { 
            "month":month
          }
        },
        // Unwind daily expenses
        { $unwind: "$dailyExpenses" },
        
        // Unwind each category within daily expenses
        { $unwind: { path: "$dailyExpenses.travels", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$dailyExpenses.foods", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$dailyExpenses.gifts", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$dailyExpenses.stationeries", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$dailyExpenses.others", preserveNullAndEmptyArrays: true } },
  
        // Project necessary fields and compute total amount
        {
          $project: {
            date: "$dailyExpenses.date",
            category: {
              $cond: [
                { $gt: ["$dailyExpenses.travels", null] }, "travels",
                { $cond: [
                  { $gt: ["$dailyExpenses.foods", null] }, "foods",
                  { $cond: [
                    { $gt: ["$dailyExpenses.gifts", null] }, "gifts",
                    { $cond: [
                      { $gt: ["$dailyExpenses.stationeries", null] }, "stationeries",
                      "others"
                    ]}
                  ]}
                ]}
              ]
            },
            amount: {
              $add: [
                { $ifNull: ["$dailyExpenses.travels.amount.cash", 0] },
                { $ifNull: ["$dailyExpenses.travels.amount.online", 0] },
                { $ifNull: ["$dailyExpenses.foods.amount.cash", 0] },
                { $ifNull: ["$dailyExpenses.foods.amount.online", 0] },
                { $ifNull: ["$dailyExpenses.gifts.amount.cash", 0] },
                { $ifNull: ["$dailyExpenses.gifts.amount.online", 0] },
                { $ifNull: ["$dailyExpenses.stationeries.amount.cash", 0] },
                { $ifNull: ["$dailyExpenses.stationeries.amount.online", 0] },
                { $ifNull: ["$dailyExpenses.others.amount.cash", 0] },
                { $ifNull: ["$dailyExpenses.others.amount.online", 0] }
              ]
            },
            purpose: {
              $switch: {
                branches: [
                  { case: { $eq: ["$category", "gifts"] }, then: { $ifNull: ["$dailyExpenses.gifts.purpose", ""] } },
                  { case: { $eq: ["$category", "stationeries"] }, then: { $ifNull: ["$dailyExpenses.stationeries.description", ""] } },
                  { case: { $eq: ["$category", "others"] }, then: { $ifNull: ["$dailyExpenses.others.description", ""] } },
                  { case: { $eq: ["$category", "travels"] }, then: { $ifNull: ["$dailyExpenses.travels.workingRemark", ""] } },
                  { case: { $eq: ["$category", "foods"] }, then: { $ifNull: ["$dailyExpenses.foods.remarks", ""] } }
                ],
                default: ""
              }
            },
            status: {
              $switch: {
                branches: [
                  { case: { $eq: ["$category", "gifts"] }, then: { $ifNull: ["$dailyExpenses.gifts.status", "pending"] } },
                  { case: { $eq: ["$category", "stationeries"] }, then: { $ifNull: ["$dailyExpenses.stationeries.status", "pending"] } },
                  { case: { $eq: ["$category", "others"] }, then: { $ifNull: ["$dailyExpenses.others.status", "pending"] } },
                  { case: { $eq: ["$category", "travels"] }, then: { $ifNull: ["$dailyExpenses.travels.status", "pending"] } },
                  { case: { $eq: ["$category", "foods"] }, then: { $ifNull: ["$dailyExpenses.foods.status", "pending"] } }
                ],
                default: "pending"
              }
            }
          }
          
        }
      ]);
  
      
      const totalExpense = expenses.reduce((accumulator, item) => accumulator + item.amount, 0);
  
      return res.status(200).json({ expenseHistory: expenses, totalExpense });
    } catch (error) {
      console.error("Error fetching expense history:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

*/
  const addFoodExpense = async (req, res) => {
    try {
      const {
        name,
        employeeId,
        place,
        date,
        city,
        outSideOfCity,
        // modeOfTransport,
        amount,
        mealType,
        billNumber,
      } = req.body;
  
      // Check for required fields
      if (!name || !place || !date || !employeeId) {
        return res.status(400).json({
          success: false,
          message: "Name, place, date, and employeeId are required",
        });
      }
  
      // Validate and parse date
      const expenseDate = new Date(date);
      if (isNaN(expenseDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format",
        });
      }
  
      // Generate month string from date
      const month =
        expenseDate.toLocaleString("default", { month: "long" }) +
        " " +
        expenseDate.getFullYear();
  
      // Define travel expense object
      const foodExpense = {
        date: expenseDate,
        city,
        outSideOfCity,
        //modeOfTransport,
        amount: amount || { cash: 0, online: 0 },
        mealType,
        billNumber,
        receipt: req.file ? req.file.path : null,
        status: "pending",
      };
  
      // Define the start and end of the day for the expense date
      const startOfDay = new Date(expenseDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(expenseDate);
      endOfDay.setHours(23, 59, 59, 999);
  
      // Find or create an expense entry
      let expense = await Expense.findOne({
        employeeId,
        place,
        month,
      });
  
      if (expense) {
        // Check if a daily expense already exists for the specified date
        let dayExpense = expense.dailyExpenses.find(
          (day) =>
            new Date(day.date) >= startOfDay && new Date(day.date) <= endOfDay
        );
  
        if (dayExpense) {
          dayExpense.foods.push(foodExpense);
        } else {
          expense.dailyExpenses.push({
            date: expenseDate,
            foods: [foodExpense],
          });
        }
      } else {
        // Create a new expense entry
        expense = new Expense({
          name,
          employeeId,
          place,
          month,
          dailyExpenses: [
            {
              date: expenseDate,
              foods: [foodExpense],
            },
          ],
        });
      }
  
      // Sort daily expenses by date
      expense.dailyExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
  
      await expense.save();
  
      return res.status(201).json({
        success: true,
        message: "Food expense added successfully",
        data: expense,
      });
    } catch (error) {
      console.error("Error adding food expense:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  const addTravelExpense = async (req, res) => {
    try {
      const {
        name,
        employeeId,
        place,
        date,
        city,
        outSideOfCity,
        modeOfTransport,
        amount,
        placeVisited,
        departure,
        destination,
        billNumber,
        workingRemark,
        travelDate,
      } = req.body;
  
      if (!name || !place || !date || !employeeId) {
        return res.status(400).json({
          success: false,
          message: "Name, place, date and employeeId are required",
        });
      }
  
      // Validate and parse dates
      const expenseDate = new Date(date);
      if (isNaN(expenseDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format",
        });
      }
  
      // Generate month string from date
      const month =
        expenseDate.toLocaleString("default", { month: "long" }) +
        " " +
        expenseDate.getFullYear();
  
      const travelExpense = {
        date: expenseDate,
        city,
        outSideOfCity,
        modeOfTransport,
        amount: amount || { cash: 0, online: 0 },
        placeVisited,
        departure,
        destination,
        billNumber,
        workingRemark,
        travelDate,
        receipt: req.file ? req.file.path : null,
        status: "pending",
      };
  
      const startOfDay = new Date(expenseDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(expenseDate);
      endOfDay.setHours(23, 59, 59, 999);
  
      let expense = await Expense.findOne({
        employeeId,
        place,
        month,
      });
  
      if (expense) {
        // Find if there's already an expense for this date
        let dayExpense = expense.dailyExpenses.find(
          (day) =>
            new Date(day.date) >= startOfDay && new Date(day.date) <= endOfDay
        );
  
        if (dayExpense) {
          dayExpense.travels.push(travelExpense);
        } else {
          expense.dailyExpenses.push({
            date: expenseDate,
            travels: [travelExpense],
          });
        }
      } else {
        expense = new Expense({
          name,
          employeeId,
          place,
          month,
          dailyExpenses: [
            {
              date: expenseDate,
              travels: [travelExpense],
            },
          ],
        });
      }
  
      expense.dailyExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
  
      await expense.save();
  
      return res.status(201).json({
        success: true,
        message: "Travel expense added successfully",
        data: expense,
      });
    } catch (error) {
      console.error("Error adding travel expense:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
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
    addFoodExpense,
    addTravelExpense
    };
