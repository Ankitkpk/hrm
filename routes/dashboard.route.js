const express = require("express")
const router = express.Router()
const dashboardController = require("../controllers/dashboard.controller");
const checkCompanyId = require("../middlewares/checkCompanyId.middleware");



router.get("/weeklyAttendance", checkCompanyId, dashboardController.getWeeklyAttendanceByDepartment);
router.get("/weeklyAttendance/:id", checkCompanyId, dashboardController.getWeeklyAttendanceById)
router.get("/getMonthlyCalendarEvents", checkCompanyId, dashboardController.getMonthlyCalendarEvents);
router.get("/getspecialDays", checkCompanyId, dashboardController.getspecialDays)
router.post("/createMeeting", checkCompanyId, dashboardController.createMeeting)



module.exports = router ;