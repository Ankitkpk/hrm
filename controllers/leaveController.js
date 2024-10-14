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
    res.status(200).json(totalleaves);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
    res.status(200).json(pendingleaves);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
    res.status(200).json(leavestaken);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const uploadLeaveData = async (req, res) => {
  const {
    appliedDate,
    fromDate,
    toDate,
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

    const add = new addLeave({
      appliedDate,
      fromDate,
      toDate,
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
    res.status(200).json({ leave });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave application", error });
  }
};

module.exports = {
  totalLeaves,
  pendingLeaves,
  leavesTaken,
  uploadLeaveData,
  getLeaveWithEmployeeData
};
