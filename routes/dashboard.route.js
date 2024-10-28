const express = require("express")
const router = express.Router()
const dashboardController = require("../controllers/dashboard.controller");
const checkCompanyId = require("../middlewares/checkCompanyId.middleware");



router.get("/weeklyAttendance", checkCompanyId, dashboardController.getWeeklyAttendanceByDepartment);
router.get("/weeklyAttendance/:id", checkCompanyId, dashboardController.getWeeklyAttendanceById)
router.get("/getMonthlyCalendarEvents", checkCompanyId, dashboardController.getMonthlyCalendarEvents);
router.get("/getspecialDays", checkCompanyId, dashboardController.todaySpecialDays)
router.post("/createMeeting", checkCompanyId, dashboardController.createMeeting)
router.post('/calendar', dashboardController.createCalendarEntry);
router.get('/getOverallMeetingStatus/:id',dashboardController.getOverallMeetingStatus)
router.get('/getEmailAndName',dashboardController.getEmailAndName)
router.get("/getDepartmentChart",dashboardController.getDepartmentChart)
router.get('/getTotalNumOfEmp',dashboardController.totalEmployees)
router.get('/getTotalAttendanceDashboard', dashboardController.getTotalAttendanceDashboard);
router.get('/getMeetingDetail/:id', dashboardController.getMeetingDetail);

module.exports = router ;