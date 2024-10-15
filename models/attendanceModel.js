const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HRMEmployee",
    required: true,
  },
  totalLeavesTaken: { type: Number, default: 0 },
  totalPresent: { type: Number, default: 0 },
  dailyAttendance: [
    {
      date: { type: Date, default: Date.now },
      status: { type: String, enum: ["Present", "Absent"], required: true },
    },
  ],
});

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;