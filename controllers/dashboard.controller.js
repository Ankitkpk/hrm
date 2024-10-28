const User = require("../models/user.model");
const Attendance = require("../models/attendance.model");
const moment = require("moment");
const Calendar = require("../models/calender.model");
const Meeting = require("../models/meeting.model");
const setReminder = require("../utils/meetingReminder");
const HRMEmployee = require("../models/HRMEmployeeModel");

// Endpoint to get weekly attendance record

const createCalendarEntry = async (req, res) => {
  try {
    const { date, holidays, leaves, meetings, companyId } = req.body;

    // Check if a calendar entry already exists for the given date and company
    const existingEntry = await Calendar.findOne({ date, companyId });
    if (existingEntry) {
      return res.status(400).json({
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
    return res.status(201).json({
      message: "Calendar entry created successfully",
      calendarEntry: newCalendarEntry,
    });
  } catch (error) {
    console.error("Error creating calendar entry:", error);
    return res.status(500).json({ message: "Server error" });
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
    return res.status(500).json({ message: error.message });
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
    return res.status(200).json(calendarEvents);
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
      let eventCelebration = "";

      // Determine if the event is a birthdate or anniversary based on matching field
      const isBirthdayMatch =
        moment(event.birthdate).format("MM-DD") === currentMonthDay;
      const isAnniversaryMatch =
        moment(event.anniversary_date).format("MM-DD") === currentMonthDay;

      if (isBirthdayMatch) {
        eventCelebration = "Birthday";
      } else if (isAnniversaryMatch) {
        eventCelebration = "Anniversary";
      }

      // Return the original event data along with the eventCelebration field
      return {
        name: event.name, // Include the name field properly
        eventCelebration, // Add eventCelebration field
      };
    });

    // Return the special days as a structured response
    return res.status(200).json({
      success: true,
      todaySpecialEvents: modifiedEvents, // Send modified events with eventCelebration field
    });
  } catch (error) {
    console.error("Error fetching special days:", error);
    return res.status(500).json({
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
      time,
      date,
      location,
      description,
      reminder,
      userID,
    } = req.body;
    // const name = await
    // Validate required fields
    if (!title || !participants || !time) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    const companyId = req.headers['companyid']

    // Create a new meeting object
    const newMeeting = new Meeting({
      title,
      participants,
      date,
      time,
      location,
      description,
      companyId,
      reminder,
      organizer: userID,
    });

    // Save the meeting to the database
    const savedMeeting = await newMeeting.save();
    setReminder(newMeeting);
    return res.status(201).json(savedMeeting);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error creating meeting", error: error.message });
  }
};

const getEmailAndName = async (req, res) => {
  try {
    const attendeesdata = await HRMEmployee.find().select(
      "employeeName officialEmailId -_id"
    );
    return res.status(200).json(attendeesdata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting attendees data" });
  }
};

const getOverallMeetingStatus = async (req, res) => {
  const { id } = req.params;

  const currentDateTime = moment().tz("Asia/Kolkata").format();
  const sevenDaysAgo = moment().tz("Asia/Kolkata").subtract(7, "days").format();

  try {
    const emp = await HRMEmployee.findById(id);
    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const nextMeeting = await Meeting.find({
      startDate: { $gte: currentDateTime },
    })
      .sort({ startDateTime: 1 })
      .select("title startDate -_id")
      .limit(1);

    const lastMeeting = await Meeting.find({
      startDate: { $gte: sevenDaysAgo, $lte: currentDateTime },
      status: { $eq: "Completed" },
    })
      .sort({ date: -1, time: -1 })
      .select("title startDate -_id")
      .limit(1);

    const totalscheduleMeetings = await Meeting.countDocuments({
      startDate: { $gte: sevenDaysAgo, $lte: currentDateTime },
      status: { $eq: "Completed" },
    });

    const completedMettings = await Meeting.countDocuments({
      startDate: { $gte: sevenDaysAgo, $lte: currentDateTime },
      status: "Completed",
    });
    const canceledMettings = await Meeting.countDocuments({
      startDate: { $gte: sevenDaysAgo, $lte: currentDateTime },
      status: "Canceled",
    });
    const pendingMettings = await Meeting.countDocuments({
      startDate: { $gte: sevenDaysAgo, $lte: currentDateTime },
      status: "Pending",
    });

    const response = {
      nextMeeting,
      lastMeeting,
      totalscheduleMeetings,
      completedMettings,
      canceledMettings,
      pendingMettings,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const getDepartmentChart = async(req,res)=>{
  try {
    const result = await HRMEmployee.aggregate([
      {
        $group: {
          _id: "$department", 
          count: { $sum: 1 }, // Count the number of employees in each department
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" }, // Calculate the total number of employees
          departments: {
            $push: {
              department: "$_id",
              count: "$count",
            },
          },
        },
      },
      {
        $unwind: "$departments", // Unwind to access each department
      },
      {
        $project: {
          _id: 0,
          department: "$departments.department",
          percentage: {
            $round:[
              {
              $multiply: [
                { $divide: ["$departments.count", "$total"] }, // Calculate percentage
                100,
              ]},
              2
            ]
          },
        },
      },
    ]);

    console.log(result);
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json("Error calculating department percentage:", error.message);
  }
}

const totalEmployees= async(req,res)=>{
  try {
    // Fetch total number of employees from the database
    const total = await HRMEmployee.countDocuments({});
    res.status(200).json({ totalEmployees: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving employee data', error:err.message});
  }
}


const getTotalAttendanceDashboard = async (req, res) => {
  try {

   
    const currentDay = moment().startOf('day').format('YYYY-MM-DD');
   
    const todayAttendance = await Attendance.find({
      'dailyAttendance.date':currentDay,
      'dailyAttendance.status':"Present"
     
    });  

   
    const presentCount = todayAttendance.length;
    const totalEmployees = await HRMEmployee.countDocuments();
    const attendancePercentage = totalEmployees > 0 ? (presentCount / totalEmployees) * 100 : 0;

    res.status(200).json({
      totalEmployees,
      presentCount,
      attendancePercentage: attendancePercentage.toFixed(2) + '%'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error.message });
    
  }
};

module.exports = {
  createCalendarEntry,
  getWeeklyAttendanceById,
  getWeeklyAttendanceByDepartment,
  getMonthlyCalendarEvents,
  todaySpecialDays,
  createMeeting,
  getOverallMeetingStatus,
  getEmailAndName,
  getDepartmentChart,
  totalEmployees,
  getTotalAttendanceDashboard
};
