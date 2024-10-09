const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  positionApplied: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    required: true,
  },
  emergencyContact: {
    type: String,
    required: true,
  },
  residentialAddress: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  cv: { type: String },
  relievingLetter: { type: String },
  bankDetails: { type: String },
  aadharCard: { type: String },
  postalAddress: { type: String },
  permanentAddress: { type: String },
  offerAcceptance: {
    type: Boolean,
    default: false,
  },
  documentSubmission: {
    type: Boolean,
    default: false,
  },
  backgroundCheck: {
    type: Boolean,
    default: false,
  },
  trainingSchedule: {
    type: Boolean,
    default: false,
  },
  itSetup: {
    type: Boolean,
    default: false,
  },
  finalReview: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Employee", employeeSchema);
