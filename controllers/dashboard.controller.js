const User = require("../models/user.model");
const Attendance = require("../models/attendance.model");
const moment = require("moment");
const Calendar = require("../models/calender.model");
const Meeting = require("../models/meeting.model");

// Endpoint to get weekly attendance record

const getWeeklyAttendanceById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get the user object by ID
    const user = await User.findById(userId);

    // Get the current week's date range
    const startDate = moment().startOf("week").toDate();
    const endDate = moment().endOf("week").toDate();

    // Find all attendance records within the specified date range
    const attendanceRecords = await Attendance.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Calculate the total number of days worked and the total hours worked
    let totalDaysWorked = 0;
    let totalHoursWorked = 0;

    attendanceRecords.forEach((record) => {
      totalDaysWorked += record.daysWorked;
      totalHoursWorked += record.hoursWorked;
    });

    res.json({ totalDaysWorked, totalHoursWorked, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWeeklyAttendanceByDepartment = async (weekStart, weekEnd) => {
  try {
    // Find attendance records for the specified week, including user data
    const attendanceRecords = await Attendance.find({
      date: {
        $gte: weekStart.toDate(),
        $lte: weekEnd.toDate(),
      },
    })
      .populate("userId")
      .lean();

    // Group attendance records by employee and department
    const employeeAttendanceByDepartment = attendanceRecords.reduce(
      (acc, attendance) => {
        const department = attendance.userId.department;
        const employeeId = attendance.userId._id;
        if (!acc[department]) {
          acc[department] = {};
        }
        if (!acc[department][employeeId]) {
          acc[department][employeeId] = {
            name: attendance.userId.name,
            totalAttendance: 1,
          };
        } else {
          acc[department][employeeId].totalAttendance++;
        }
        return acc;
      },
      {}
    );

    return employeeAttendanceByDepartment;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Controller to fetch all calendar events (leaves, holidays, and meetings) month-wise
const getMonthlyCalendarEvents = async (req, res) => {
  try {
    const { month, year } = req.params;

    // Convert month and year to numbers
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(monthNum) || isNaN(yearNum)) {
      return res.status(400).json({ error: "Invalid month or year provided." });
    }

    // Create start and end dates for the month
    const startDate = new Date(yearNum, monthNum - 1, 1); // Start of the month
    const endDate = new Date(yearNum, monthNum, 0); // End of the month

    // Query the Calendar collection for the events within the specified month
    const calendarEvents = await Calendar.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("holidays")
      .populate("leaves")
      .populate({
        path: "meetings",
        populate: { path: "participants" }, // Populate meeting participants
      })
      .lean();

    // Respond with the fetched events
    res.status(200).json(calendarEvents);
  } catch (err) {
    console.error("Error fetching monthly calendar events:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching calendar events." });
  }
};


const getSpecialDaysEvents = async (req, res) => {
  try {
    // Get the current month (0-indexed)
    const currentMonth = moment().month(); // 0 = January, 11 = December

    // Use aggregation to find users with either a birthdate or anniversary date that matches the current month
    const upcomingBirthdays = await User.aggregate([
      {
        $project: {
          name: 1, // Include the name in the result
          birthdate: 1,
          birthMonth: { $month: "$birthdate" }, // Extract birth month
        }
      },
      {
        $match: {
          birthMonth: currentMonth + 1 // Match birth month (1-indexed)
        }
      }
    ]);

    const upcomingAnniversaries = await User.aggregate([
      {
        $project: {
          name: 1, // Include the name in the result
          anniversary_date: 1,
          anniversaryMonth: { $month: "$anniversary_date" } // Extract anniversary month
        }
      },
      {
        $match: {
          anniversaryMonth: currentMonth + 1 // Match anniversary month (1-indexed)
        }
      }
    ]);

    // Combine results while ensuring no duplicates
    const uniqueUpcomingSpecialDays = [...upcomingBirthdays, ...upcomingAnniversaries].reduce((acc, curr) => {
      if (!acc.find(item => item._id.equals(curr._id))) {
        acc.push(curr);
      }
      return acc;
    }, []);

    // Check if any special days were found
    if (uniqueUpcomingSpecialDays.length === 0) {
      return res.status(404).json({ message: "No special days found for this month." });
    }

    // Return the special days as a structured response
    res.status(200).json({
      success: true,
      upcomingSpecialDays: uniqueUpcomingSpecialDays
    });
  } catch (error) {
    console.error("Error fetching special days:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching special days."
    });
  }
};
 



const createMeeting = async (req, res) => {
  try {
    const {
      title,
      participants,
      startTime,
      endTime,
      location,
      agenda,
      companyId,
    } = req.body;

    // Validate required fields
    if (!title || !participants || !startTime || !endTime) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Create a new meeting object
    const newMeeting = new Meeting({
      title,
      participants,
      startTime,
      endTime,
      location,
      agenda,
      companyId,
    });

    // Save the meeting to the database
    const savedMeeting = await newMeeting.save();

    res.status(201).json(savedMeeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating meeting" });
  }
};

module.exports = {
  getWeeklyAttendanceById,
  getWeeklyAttendanceByDepartment,
  getMonthlyCalendarEvents,
  getSpecialDaysEvents,
  createMeeting,
};
