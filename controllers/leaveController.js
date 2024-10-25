const HRMEmployee = require("../models/HRMEmployeeModel");
const addLeave = require("../models/employeeLeaveModel");

const totalLeaves = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await HRMEmployee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const totalleaves = employee.totalLeave;
    return res.status(200).json(totalleaves);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const pendingLeaves = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await HRMEmployee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const pendingleaves = employee.pendingLeaves;
    return res.status(200).json(pendingleaves);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const leavesTaken = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await HRMEmployee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const leavestaken = employee.leavesTaken;
    return res.status(200).json(leavestaken);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const uploadLeaveData = async (req, res) => {
  const {
    appliedDate,
    fromDate,
    toDate,
    leaveType,
    reason, 
    applyTo,
    employee,
  } = req.body;

  try {
    const { document } = req.files;
    let data;
    if (document) {
      data = document[0]?.originalname;
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const diffTime = endDate - startDate;
    
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const add = new addLeave({
      appliedDate,
      fromDate,
      toDate,
      totalDays,
      leaveType,
      reason,
      applyTo,
      employee, 
      documents: {
        data: data,
      },
    });

    await add.save();
    return res
      .status(201)
      .json({ message: "Applied for leave", addLeave });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const getLeaveWithEmployeeData = async (req, res) => {
  const { leaveId } = req.params; 
  try {
    const leave = await addLeave.findById(leaveId).populate('employee');  
    if (!leave) {
      return res.status(404).json({ message: "Leave application not found" });
    }
    return res.status(200).json({ leave });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching leave application", error });
  }
};

const getAllEmployeeLeaves = async (req,res)=>{
 try{
  const data = await addLeave.find().populate('employee')
  if(!data){
    return res.status(404).json({message:"No leaves found"})
  }
  return res.status(200).json({data})
 }catch(error){
  return res.status(500).json({message:'Error fetching leaves'})
 }
}

const getEmployeeLeave=async(req,res)=>{
  try{
    const data = await addLeave.find().populate('employee')
    if(!data){
      return res.status(404).json({message:"No employee leaves found"})
    }
    const result = data.map((leave) => ({
      employeeName: leave.employee.employeeName,
      leaveType: leave.leaveType,
      startDate: leave.fromDate,
      endDate: leave.toDate,
      status: leave.status,
      totalDays: leave.totalDays,
    }));

    return res.status(200).json(result)
   }catch(error){
    return res.status(500).json({message:error.message})
   }
}

const getEmployeeLeaveSummary = async (req, res) => {
  const { id } = req.params;

  try {
    const leaveDetails = await addLeave.find({ employee: id }).populate('employee').populate({
      path: 'employee', 
      select: 'leavesTaken totalLeave',
    });

    if (!leaveDetails || leaveDetails.length === 0) {
      return res.status(404).json({ message: 'No leave records found for this employee.' });
    }

    const leaveSummary = leaveDetails.reduce((acc, leave) => {      
      acc.casualLeavesTaken += leave.employee.leavesTaken.casualLeaves || 0;
      acc.sickLeavesTaken += leave.employee.leavesTaken.sickLeaves || 0;
      acc.festivalsTaken += leave.employee.leavesTaken.festivals || 0;
      acc.totalCasualLeaves = leave.employee.totalLeave.casualLeaves || acc.totalCasualLeaves;
      acc.totalSickLeaves = leave.employee.totalLeave.sickLeaves || acc.totalSickLeaves;
      acc.totalFestivalLeaves = leave.employee.totalLeave.festivals || acc.totalFestivalLeaves;    
      acc.leaveTypeSet.add(leave.leaveType);

      return acc;
    }, {
      casualLeavesTaken: 0,
      sickLeavesTaken: 0,
      festivalsTaken: 0,
      totalCasualLeaves: 0,
      totalSickLeaves: 0,
      totalFestivalLeaves: 0,
      leaveTypeSet: new Set() 
    });
    
    const totalLeavesTaken =
      leaveSummary.casualLeavesTaken + leaveSummary.sickLeavesTaken + leaveSummary.festivalsTaken;
    const leaveBalance =
      leaveSummary.totalCasualLeaves + leaveSummary.totalSickLeaves + leaveSummary.totalFestivalLeaves - totalLeavesTaken;

    const leaveType = Array.from(leaveSummary.leaveTypeSet).join(', ');
    
    const response = {
      totalLeavesTaken,
      leaveBalance,
      leaveType,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getEmployeeLeaveStatusAndApproval = async (req, res) => {
  const { id } = req.params;

  try {
    const leaveDetails = await addLeave.find({ employee: id })
    .populate({
      path: 'employee', 
      select: 'employeeName' 
    })
    .limit(1) 
    .select('leaveType fromDate toDate  updatedAt reason appliedDate');

    if (!leaveDetails) {
      return res.status(404).json({ message: 'No leave records found for this employee.' });
    }
    const response = leaveDetails.map((leave) => ({
      employeeName: leave.employee.employeeName,
      leaveType: leave.leaveType,
      startDate: leave.fromDate,
      endDate: leave.toDate,
      reason:leave.reason,
      appliedDate:leave.appliedDate,
      lastupdated: leave.updatedAt
    }));
    return res.status(200).json(response);

  } catch (error) {
     return res.status(500).json({ message: "Server Error", error: error.message});
  }
};

module.exports = {
  totalLeaves,
  pendingLeaves,
  leavesTaken,
  uploadLeaveData,
  getLeaveWithEmployeeData,
  getAllEmployeeLeaves,
  getEmployeeLeave,
  getEmployeeLeaveSummary,
  getEmployeeLeaveStatusAndApproval
};
