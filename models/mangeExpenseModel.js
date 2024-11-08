const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  emp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HRMEmployee",
    required: true,
  },
  expenseCategory: {
    type: String,
    enum: ["Travel", "Food", "Gifts", "Stationary", "Other"],
    required: true,
  },
  place: { type: String, required: true },
  travel: {
    date: { type: Date },
    cityTravel: { type: Boolean, default: false },
    outsideCity: { type: Boolean, default: false },
    modeOfTransport: {
      type: String,
      enum: ["Flight", "Railways", "Public transport", "Bike", "Bus"],
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
    receipts: { type: String },
  },
  food: {
    date: { type: Date },
    city: { type: Boolean, default: false },
    outsideCity: { type: Boolean, default: false },
    mealType: {
      type: String,
      enum: ["Lunch", "Dinner", "Snacks"],
    },
    amount: {
      cash: { type: Number },
      online: { type: Number },
    },
    billNumber: { type: String },
    receipts: { type: String },
  },
  gifts: {
    date: { type: Date },
    amount: {
      cash: { type: Number },
      online: { type: Number },
    },
    billNumber: { type: String },
    description: { type: String },
    receiverName: { type: String },
    receiverNumber: { type: String },
    purpose: { type: String },
    receipts: { type: String },
  },
  stationary: {
    date: { type: Date },
    amount: {
      cash: { type: Number },
      online: { type: Number },
    },
    billNumber: { type: String },
    description: { type: String },
    receipts: { type: String },
  },
  other: {
    date: { type: Date },
    amount: {
      cash: { type: Number },
      online: { type: Number },
    },
    billNumber: { type: String },
    description: { type: String },
    receipts: { type: String },
  },
  limitExceed: { 
    explanation: { type: String },
    amount: { type: Number },
    message: { type: String }
   },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
