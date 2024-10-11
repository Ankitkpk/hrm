const HRMEmployee=require("../models/HRMEmployeeModel");

const totalLeaves=async(req,res)=>{
    const { id } = req.params;   
    try {
        const employee = await HRMEmployee.findById(id);
     
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      const totalleaves=employee.totalLeave
      res.status(200).json(totalleaves);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
}

const pendingLeaves=async(req,res)=>{
    const { id } = req.params;   
    try {
        const employee = await HRMEmployee.findById(id);
     
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      const pendingleaves=employee.pendingLeaves
      res.status(200).json(pendingleaves);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
}

const leavesTaken=async(req,res)=>{
    const { id } = req.params;   
    try {
        const employee = await HRMEmployee.findById(id);
     
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      const leavestaken=employee.leavesTaken
      res.status(200).json(leavestaken);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
}



module.exports = {
    totalLeaves,
    pendingLeaves,
    leavesTaken
  };