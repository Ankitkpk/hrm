const Attendance = require("../models/attendanceModel");
const HRMEmployee = require("../models/HRMEmployeeModel");

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
    //const currentMonth = new Date().toLocaleString('default', { month: 'long' }) + ' ' + new Date().getFullYear();
    const currentMonth = "December 2025";
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

      if(!currentMonthData){
        return res.status(404).json({message:'Employee not fount'})
      }

    let weekData = [...currentMonthData[0].dailyAttendance.reverse().flat(1)];
    // console.log('week data',weekData);

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
      // console.log(lastMonthData[0].dailyAttendance);
      weekData = [...weekData, ...lastMonthData[0].dailyAttendance.reverse()];
    }

    return res.status(200).json(weekData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching weekly attendance", error });
  }
};

module.exports = {
  getWeeklyAttendance,
  markAttendance,
  getAttendanceSummaryByMonth,
  getTwoMonthAttendance,
};
