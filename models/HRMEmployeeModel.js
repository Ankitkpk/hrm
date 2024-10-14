const mongoose = require("mongoose");

const HRMEmployeeSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  qualification: {
    type: [String],
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  maritalStatus: {
    type: String,
    required: true,
  },
  anniversaryDate: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  alternatePhoneNumber: {
    type: String,
    required: true,
  },
  emergencyNumber: {
    type: String,
    required: true,
  },
  relationWithPerson: {
    type: String,
    required: true,
  },
  officialEmailId: {
    type: String,
    required: true,
  },
  personalEmailId: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  aadharCard: {
    type: String,
    required: true,
  },
  panCard: {
    type: String,
    required: true,
  },
  bankAccountName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
  ifscCode: {
    type: String,
    required: true,
  },
  totalLeave: {
    casualLeaves: { type: Number, default: 15 },
    festivals:{type:Number,default:30},
    sickLeaves:{type:Number,default:12}
  },
  pendingLeaves:{
    casualLeaves: { type: Number ,default: 15 },
    festivals:{type:Number,default:30},
    sickLeaves:{type:Number,default:12}
  },
  leavesTaken:{
    casualLeaves: { type: Number,default:0  },
    festivals:{type:Number,default:0},
    sickLeaves:{type:Number, default:0}
  }
});

module.exports = mongoose.model("HRMEmployee", HRMEmployeeSchema);