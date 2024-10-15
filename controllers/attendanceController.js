const Attendance = require("../models/attendanceModel");

// POST API to mark attendance
const attendance = async (req, res) => {
  const { employeeId } = req.params;
  const { status } = req.body; // should be "Present" or "Absent"

  try {
    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({ error: "Invalid attendance status" });
    }

    let attendance = await Attendance.findOne({ employee: employeeId });
    if (!attendance) {
      attendance = new Attendance({ employee: employeeId });
    }
    attendance.dailyAttendance.unshift({status});
    if(status === 'Present'){
        attendance.totalPresent +=1
    }else if(status === 'Absent'){
        attendance.totalLeavesTaken +=1
    }
    await attendance.save();
    res.status(200).json({ message: `Attendance marked as ${status} ` }); // Fixed template literals here
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Error marking attendance" });
  }
};

module.exports = {
  attendance,
};
