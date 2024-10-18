const User = require("../models/user.model");
const Attendance = require("../models/attendance.model");
const moment = require("moment");
const Calendar = require("../models/calender.model");
const Meeting = require("../models/meeting.model");

// Endpoint to get weekly attendance record



const createCalendarEntry = async (req, res) => {
  try {
    const { date, holidays, leaves, meetings, companyId } = req.body;

    // Check if a calendar entry already exists for the given date and company
    const existingEntry = await Calendar.findOne({ date, companyId });
    if (existingEntry) {
      return res.status(400).json({ message: "Calendar entry already exists for this date and company." });
    }

    // Create a new calendar entry
    const newCalendarEntry = new Calendar({
      date,
      holidays,
      leaves,
      meetings,
      companyId,
    });

    // Save the calendar entry to the database
    await newCalendarEntry.save();

    // Respond with a success message and the newly created entry
    res.status(201).json({
      message: "Calendar entry created successfully",
      calendarEntry: newCalendarEntry,
    });
  } catch (error) {
    console.error("Error creating calendar entry:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createCalendarEntry };



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


const getspecialDays = async (req, res) => {
  try {
    
    const currentMonth = moment().month() + 1;

   
    const upcomingSpecialDays = await User.aggregate([
      {
        $project: {
          name: 1,
          birthdate: 1,
          anniversary_date: 1,
          birthMonth: { $month: "$birthdate" },
          anniversaryMonth: { $month: "$anniversary_date" }
        }
      },
      {
        $match: {
          $or: [
            { birthMonth: currentMonth },          // Match users with birth month in the current month
            { anniversaryMonth: currentMonth }     // Match users with anniversary month in the current month
          ]
        }
      },
      {
        $project: {
          name: 1,                        // Include the name in the final output
          event: {
            $cond: [
              { $eq: ["$birthMonth", currentMonth] },
              "Birthday",
              "Anniversary"
            ]
          }                               // Label the event as either 'Birthday' or 'Anniversary'
        }
      }
    ]);

    // Separate the results into birthdays and anniversaries
    const birthdays = upcomingSpecialDays.filter(day => day.event === "Birthday");
    const anniversaries = upcomingSpecialDays.filter(day => day.event === "Anniversary");

    // Return the special days as a structured response
    res.status(200).json({
      success: true,
      upcomingSpecialDays: {
        birthdays,    // Array of users with upcoming birthdays
        anniversaries // Array of users with upcoming anniversaries
      }
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
      reminder
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
      location,
      agenda,
      companyId,
      reminder
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
  createCalendarEntry,
  getWeeklyAttendanceById,
  getWeeklyAttendanceByDepartment,
  getMonthlyCalendarEvents,
  getspecialDays,
  createMeeting,
};


