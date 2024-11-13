const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HRMEmployee",
    required: true,
  },
  expenseCategory: {
    type: String,
    required: true,
  },
  place: { type: String, required: true },
  travel: {
    date: { type: Date },
    city: { type: Boolean, default: false },
    outSideOfCity: { type: Boolean, default: false },
    modeOfTransport: {
      type: String,
    },
    amount: {
      cash: { type: Number },
      online: { type: Number },
    },
    placeVisited: { type: String },
    departure: { type: String },
    destination: { type: String },
    billNumber: { type: String },
    workingRemark: { type: String },
    travelDate: { type: Date },
    receipt: { type: String },
    limitExceed: { 
      explanation: { type: String },
      amount: { type: Number },
      message: { type: String }
     },
  },
  food: {
    date: { type: Date },
    city: { type: Boolean, default: false },
    outSideOfCity: { type: Boolean, default: false },
    mealType: {
      type: String,
    },
    amount: {
      cash: { type: Number },
      online: { type: Number },
    },
    billNumber: { type: String },
    receipt: { type: String },
    limitExceed: { 
      explanation: { type: String },
      amount: { type: Number },
      message: { type: String }
     },
  },
  gifts: {
    date: { type: Date },
    amount: {
      category: { type: String },
      pay: { type: Number },
    },
    billNumber: { type: String },
    description: { type: String },
    receiverName: { type: String },
    receiverNumber: { type: String },
    purpose: { type: String },
    receipt: { type: String },
    limitExceed: { 
      explanation: { type: String },
      amount: { type: Number },
      message: { type: String }
     },
  },
  stationary: {
    date: { type: Date },
    amount: {
      cash: { type: Number },
      online: { type: Number },
    },
    billNumber: { type: String },
    description: { type: String },
    receipt: { type: String },
    limitExceed: { 
      explanation: { type: String },
      amount: { type: Number },
      message: { type: String }
     },
  },
  other: {
    date: { type: Date },
    amount: {
      cash: { type: Number },
      online: { type: Number },
    },
    billNumber: { type: String },
    description: { type: String },
    receipt: { type: String },
    limitExceed: { 
      explanation: { type: String },
      amount: { type: Number },
      message: { type: String }
     },
  },
  
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;