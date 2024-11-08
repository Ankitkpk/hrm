const Attendance = require("../models/attendanceModel");
const HRMEmployee = require("../models/HRMEmployeeModel");
const moment = require("moment");


// Get attendance summary for an employee for a month
const getAttendanceSummaryByMonth = async (req, res) => {
  const { employeeId } = req.params;
  const { month } = req.query;

  try {
    const attendance = await Attendance.findOne({
      employee: employeeId,
      month: month,
    });

    if (!attendance) {
      return res
        .status(404)
        .json({ message: "Attendance not found for this month" });
    }

    return res.status(200).json(attendance);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching attendance summary", error });
  }
};

// Mark daily attendance
const markAttendance = async (req, res) => {
  //remove leaveType
  const { employeeId, date, status } = req.body;

  try {
    if(!employeeId){
      return res.status(404).json({message:'Employee not found'})
    }
    // Determine the current month (Month Year format)
    const currentMonth = new Date().toLocaleString('default', { month: 'long' }) + ' ' + new Date().getFullYear();
    // const currentMonth = "December 2025";
    // Find the attendance record for the employee in the current month
    let attendance = await Attendance.findOne({
      employee: employeeId,
      month: currentMonth,
    });

    // If no attendance record exists for the current month, create a new one
    if (!attendance) {
      attendance = new Attendance({
        employee: employeeId,
        month: currentMonth,
        totalPresent: 0,
        totalLeavesTaken: 0,
      });
    }

    // Add the daily attendance for the new date
    attendance.dailyAttendance.push({ date: date || new Date(), status });

    // Update the total present/absent days based on status
    if (status === "Present") {
      attendance.totalPresent += 1;
    } else if (status === "Absent") {
      attendance.totalLeavesTaken += 1;
    }

    // Save the updated attendance document
    await attendance.save();

    return res
      .status(200)
      .json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    return res.status(500).json({ message: "Error marking attendance", error });
  }
};

const getTwoMonthAttendance = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const data = await Attendance.find(
      { employee: employeeId },
      "month totalLeavesTaken totalPresent"
    )
      .sort({ createdAt: -1 });
      // .limit(2);
    if (!data) {
     return res.status(404).json({ message: "Data not found" });
    }
   return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching data", error });
  }
};

// Get weekly attendance
const getWeeklyAttendance = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const currentMonthData = await Attendance.find(
      { employee: employeeId },
      "dailyAttendance"
    )
      .sort({ createdAt: -1 })
      .limit(1);
// console.log(currentMonthData[0].dailyAttendance);

      if(!currentMonthData){
        return res.status(404).json({message:'Employee not fount'})
      }

    let weekData = [...currentMonthData[0].dailyAttendance.reverse().flat(1)];
     console.log('week data',weekData);

    if (
      currentMonthData[0].dailyAttendance.length < 7 ||
      currentMonthData[0].dailyAttendance.length === 0
    ) {
      const limit = 7 - currentMonthData[0].dailyAttendance.length;
      // console.log(currentMonthData[0].dailyAttendance.length);

      // console.log(limit);

      const lastMonthData = await Attendance.find(
        { employee: employeeId },
        "dailyAttendance"
      )
        .sort({ createdAt: -1 })
        .skip(1)
        .limit(limit);
        if(lastMonthData.length){
          weekData = [...weekData, ...lastMonthData[0].dailyAttendance.reverse()];
        }
      // console.log("lAT month",lastMonthData[0].dailyAttendance);
    }

    return res.status(200).json(weekData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching weekly attendance", error: error.message });
  }
};

const getEmpWeeklyAttendance = async (req, res) => {
  const currentMonth = moment().format('MMMM YYYY');
  try {
    const startOfWeek = moment().startOf('week'); 
    const endOfWeek = moment().endOf('week'); 


    const attendanceRecords = await Attendance.find({
      month: currentMonth,
      'dailyAttendance.date': { $gte: startOfWeek.toDate(), $lte: endOfWeek.toDate() },
      'dailyAttendance.status': 'Present',
    });

    const presentCount = attendanceRecords.reduce((count, record) => {
      const weeklyAttendance = record.dailyAttendance.filter(attendance => {
        const attendanceDate = moment(attendance.date);
        return attendanceDate.isBetween(startOfWeek, endOfWeek, null, '[]');
      });
      return count + weeklyAttendance.length; 
    }, 0);


    const totalEmployees = await HRMEmployee.countDocuments();
    const attendancePercentage = totalEmployees > 0 ? (presentCount / totalEmployees) * 100 : 0;

    
    const response = {
      week: `${startOfWeek.format('MMMM D')} - ${endOfWeek.format('MMMM D')}`,
      presentCount,
      attendancePercentage,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching weekly attendance", error: error.message });
  }
};


const getEmployeeList = async (req, res) => {
  try {
   
    const currentMonthDay = Moment().format("YYYY-MM-DD");
    // const month = req.query.month;
    const currentMonth = Moment().format("MMMM YYYY");
    // Find attendance where both month and dailyAttendance.date match
    const employeeList = await Attendance.find({
      month: currentMonth,  // Match the month
      dailyAttendance: {
        $elemMatch: { date: currentMonthDay }  // Match the date in the dailyAttendance array
      }
    })
    .populate({
      path: 'employee',  // Populate employee details from HRMEmployee collection
      select: 'employeeName employeeType jobTitle'  // Select specific employee fields
    });

    // Map the results to only include the employee details and the matched attendance status
    const result = employeeList.map(attendance => {
      const matchedAttendance = attendance.dailyAttendance.find(day =>  
          (day.date).format("YYYY-MM-DD") === currentMonthDay
      );
    })

      // return {
      //   employee: employeeList,
      //   // status: matchedAttendance ? matchedAttendance.status : null // Get the status or null if not found
      // };
  

    // Send the result as a JSON response
    return res.json(result);
  } catch (err) {
    console.error(err);
  return  res.status(500).json({ message:err.message });
  }
};


const getAllEmployeeAttendanceDetails = async (req, res) => {
  try {
    const employeeRecords = await Attendance.find({}, 'attendanceDate  dailyAttendance.date dailyAttendance.status')
      .populate({
        path: 'employee',
        select: 'empId employeeName jobTitle department employeeType'
      });
      
      
      const response = employeeRecords.map(record => {
        const { date, status } = record.dailyAttendance[0] || {};
        return {
          _id: record._id,
          empId: record.employee?.empId,
          employeeName: record.employee?.employeeName,
          department: record.employee?.department,
          jobTitle: record.employee?.jobTitle,
          employeeType: record.employee?.employeeType,
          date,
          status
        };
      });
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching employee details:', error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getMonthlyAttendance = async (req, res) => {
  const currentMonth = moment().format('MMMM YYYY'); 
  const totalDaysInMonth = moment().daysInMonth(); // Get total days in the month
  const startOfMonth = moment().startOf('month');
  const endOfMonth = moment().endOf('month');

  // Count Sundays in the month
  let sundaysCount = 0;
  for (let day = startOfMonth; day.isBefore(endOfMonth); day.add(1, 'days')) {
    if (day.day() === 0) { // Sunday is 0 in moment.js
      sundaysCount++;
    }
  }

  const totalWorkingDays = totalDaysInMonth - sundaysCount; // Subtract Sundays

  try {
    const monthlyAttendance = await Attendance.aggregate([
      {
        $match: {
          month: currentMonth,
          'dailyAttendance.status': 'Present',
        },
      },
      {
        $project: {
          employee: 1,
          dailyAttendance: {
            $filter: {
              input: '$dailyAttendance',
              as: 'attendance',
              cond: {
                $and: [
                  { $eq: ['$$attendance.status', 'Present'] },
                  {
                    $ne: [
                      { $dayOfWeek: { $toDate: '$$attendance.date' } }, 
                      1 
                    ]
                  }
                ]
              },
            },
          },
        },
      },
      {
        $addFields: {
          presentCount: { $size: '$dailyAttendance' },
        },
      },
    ]);

    const totalPresentCount = monthlyAttendance.reduce((sum, record) => sum + record.presentCount, 0);
    const totalEmployees = await HRMEmployee.countDocuments();

    const attendancePercentage = totalEmployees > 0 
      ? (totalPresentCount / (totalEmployees * totalWorkingDays)) * 100 
      : 0;

    const responseData = {
      attendancePercentage: attendancePercentage.toFixed(2) + '%',
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};



module.exports = {
  getWeeklyAttendance,
  markAttendance,
  getAttendanceSummaryByMonth,
  getTwoMonthAttendance,
  getEmployeeList,
  getAllEmployeeAttendanceDetails,
  getMonthlyAttendance,
  getEmpWeeklyAttendance
};
