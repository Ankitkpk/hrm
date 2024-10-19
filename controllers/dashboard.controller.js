const User = require("../models/user.model");
const Attendance = require("../models/attendance.model");
const moment = require("moment");
const Calendar = require("../models/calender.model");
const Meeting = require("../models/meeting.model");
const setReminder = require("../utils/meetingReminder");

// Endpoint to get weekly attendance record

const createCalendarEntry = async (req, res) => {
  try {
    const { date, holidays, leaves, meetings, companyId } = req.body;

    // Check if a calendar entry already exists for the given date and company
    const existingEntry = await Calendar.findOne({ date, companyId });
    if (existingEntry) {
      return res
        .status(400)
        .json({
          message: "Calendar entry already exists for this date and company.",
        });
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

const todaySpecialDays = async (req, res) => {
  try {
    const currentMonthDay = moment().format("MM-DD"); // Get current month and day in MM-DD format

    // Find users with either a matching birthdate or anniversary_date
    const todaySpecialEvents = await User.find({
      $or: [
        {
          $expr: {
            $eq: [
              { $dateToString: { format: "%m-%d", date: "$birthdate" } },
              currentMonthDay,
            ], // Match month and day for birthdate
          },
        },
        {
          $expr: {
            $eq: [
              { $dateToString: { format: "%m-%d", date: "$anniversary_date" } },
              currentMonthDay,
            ], // Match month and day for anniversary_date
          },
        },
      ],
    });

    // Modify the results to include the "eventCelebration" field
    const modifiedEvents = todaySpecialEvents.map((event) => {
      let eventCelebration = '';

      // Determine if the event is a birthdate or anniversary based on matching field
      const isBirthdayMatch = moment(event.birthdate).format("MM-DD") === currentMonthDay;
      const isAnniversaryMatch = moment(event.anniversary_date).format("MM-DD") === currentMonthDay;

      if (isBirthdayMatch) {
        eventCelebration = 'Birthday';
      } else if (isAnniversaryMatch) {
        eventCelebration = 'Anniversary';
      }

      // Return the original event data along with the eventCelebration field
      return {
        name: event.name, // Include the name field properly
        eventCelebration, // Add eventCelebration field
      };
    });

    // Return the special days as a structured response
    res.status(200).json({
      success: true,
      todaySpecialEvents: modifiedEvents, // Send modified events with eventCelebration field
    });
  } catch (error) {
    console.error("Error fetching special days:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching special days.",
    });
  }
};



const createMeeting = async (req, res) => {
  try {
    const {
      title,
      participants,
      startTime,
      startDate,
      location,
      agenda,
      companyId,
      reminder,
    } = req.body;

    // Validate required fields
    if (!title || !participants || !startTime) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Create a new meeting object
    const newMeeting = new Meeting({
      title,
      participants,
      startDate,
      startTime,
      location,
      agenda,
      companyId,
      reminder,
    });

    // Save the meeting to the database
    const savedMeeting = await newMeeting.save();
    // setReminder(newMeeting)
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
  todaySpecialDays,
  createMeeting,
};
