const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  manageExpenseFor: {
    type: String,
    enum: ["Sales", "Screening"],
  },
  hq: String,
  name: String,
  purpose: String,
  dateOfSubmission: Date,
  lastDateOfSubmission: Date,
  location: String,
  department: String,
  manager: String,
  payPeriodFrom: String,
  dateOfJoining: Date,
  totalNoOfWorkingDays: Number,
  totalHQWorkingDays: Number,
  totalNoOfOutstationDays: Number,
  day: String,
  date: Date,
  customerHospitalNameVisited: String,
  city: String,
  fromTo: String,
  fromAreaName: String,
  modeOfTransport: String,
  attachReceipt: String, // Assume this is a URL to an uploaded receipt file
  workingRemark: String,
  amount:String,
  status:{
    type:String,
    enum:['Approved','Pending','Rejected'],
    default:"Pending"
  },
  isDeleted:{
    type:Boolean,
    default:false
  } ,
  emp:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'HRMEmployee',
    required: true,
  }
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
