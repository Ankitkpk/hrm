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
    const { documents } = req.files;
    let document;
    if (documents) {
      document = document[0]?.originalname;
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
      documents,
      employee, 
      documents: {
        data: document,
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

module.exports = {
  totalLeaves,
  pendingLeaves,
  leavesTaken,
  uploadLeaveData,
  getLeaveWithEmployeeData,
  getAllEmployeeLeaves,
  getEmployeeLeave
};
