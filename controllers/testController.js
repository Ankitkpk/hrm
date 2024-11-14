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
        travelDate
      } = req.body;
  
      if (!name || !place || !date || !employeeId) {
        return res.status(400).json({
          success: false,
          message: "Name, place, date and employeeId are required"
        });
      }
  
      // Validate and parse dates
      const expenseDate = new Date(date);
      if (isNaN(expenseDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format"
        });
      }
  
      // Generate month string from date
      const month = expenseDate.toLocaleString('default', { month: 'long' }) + ' ' + expenseDate.getFullYear();
  
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
        status: "pending"
      };
  
      const startOfDay = new Date(expenseDate);
      startOfDay.setHours(0,0,0,0);
      const endOfDay = new Date(expenseDate);
      endOfDay.setHours(23,59,59,999);
  
      let expense = await Expense.findOne({
        employeeId,
        place,
        month
      });
  
      if (expense) {
        // Find if there's already an expense for this date
        let dayExpense = expense.dailyExpenses.find(day => 
          new Date(day.date) >= startOfDay && new Date(day.date) <= endOfDay
        );
  
        if (dayExpense) {
          dayExpense.travels.push(travelExpense);
        } else {
          expense.dailyExpenses.push({
            date: expenseDate,
            travels: [travelExpense]
          });
        }
      } else {
        
        expense = new Expense({
          name,
          employeeId,
          place,
          month,
          dailyExpenses: [{
            date: expenseDate,
            travels: [travelExpense]
          }]
        });
      }
  
    
      expense.dailyExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
  
      await expense.save();
  
      return res.status(201).json({
        success: true,
        message: "Travel expense added successfully",
        data: expense
      });
  
    } catch (error) {
      console.error("Error adding travel expense:", error);
      return res.status(500).json({
        success: false,
        message: error.message
  });
  }
  };
  