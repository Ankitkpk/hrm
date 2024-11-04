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
        select: 'empId employeeName _id jobTitle department employeeType'
      });
      
      
      const response = employeeRecords.map(record => {
        const { date, status } = record.dailyAttendance[0] || {};
        return {
          _id: record._id,
          empId: record.employee?.empId,
          EmpObjectId: record.employee?._id,
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
  const daysInMonth = moment().daysInMonth(); // Automatically gets the number of days in the current month
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
              cond: { $eq: ['$$attendance.status', 'Present'] },
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
    const attendancePercentage = totalEmployees > 0 ? (totalPresentCount / (totalEmployees * daysInMonth)) * 100 : 0;

    const responseData = {
      attendancePercentage: attendancePercentage.toFixed(2) + '%',
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


function getWeeklyRangesForCurrentMonth() {
  const weeks = [];
  const startOfMonth = moment().startOf('month');
  const endOfMonth = moment().endOf('month');
  let startOfWeek = startOfMonth.clone().startOf('week'); // Start from the beginning of the week

  while (startOfWeek.isSameOrBefore(endOfMonth, 'day')) {
      const endOfWeek = moment.min(startOfWeek.clone().endOf('week'), endOfMonth);
      weeks.push({ start: startOfWeek.clone(), end: endOfWeek.clone() });
      startOfWeek = endOfWeek.add(1, 'day');
  }

  return weeks;
}

// GET API to fetch weekly attendance for the current month, excluding all Sundays
const  weeklyAttendance= async (req, res) => {
  try {
      const currentMonth = moment().month(); // 0-based month for calculations
      const currentYear = moment().year();

      const weeklyRanges = getWeeklyRangesForCurrentMonth();
      const weeklyData = [];

      for (const week of weeklyRanges) {
          // Initialize totalDays and totalPresent for this week
          let totalDays = 0;
          let totalPresent = 0;

          // Find attendance records within each weekly range
          const attendanceRecords = await Attendance.find({
              'dailyAttendance.date': { $gte: week.start.toDate(), $lte: week.end.toDate() },
          });

          attendanceRecords.forEach(record => {
              record.dailyAttendance.forEach(entry => {
                  const entryDate = moment(entry.date);

                  // Check if the date is within the current month and is not a Sunday
                  if (
                      entryDate.month() === currentMonth &&
                      entryDate.day() !== 0 && // Exclude Sundays
                      entryDate.isBetween(week.start, week.end, null, '[]')
                  ) {
                      totalDays++;
                      if (entry.status === 'Present') {
                          totalPresent++;
                      }
                  }
              });
          });

          // Calculate the attendance percentage for this week
          const attendancePercentage = totalDays > 0 ? (totalPresent / totalDays) * 100 : 0;

          // Push weekly data, even if there is no attendance record for that week
          weeklyData.push({
              weekStart: week.start.format('YYYY-MM-DD'),
              weekEnd: week.end.format('YYYY-MM-DD'),
              attendancePercentage: `${attendancePercentage.toFixed(2)}%`,
          });
      }

      return res.json({ month: currentMonth + 1, year: currentYear, weeklyData });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server Error' });
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
  weeklyAttendance
};
