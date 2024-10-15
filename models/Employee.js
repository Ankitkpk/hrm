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
    enum: [
      "Software Developer",
      "Research and Development (R&D)",
      "Human Resources",
    ],
  },
  department: {
    type: String,
    required: true,
    enum: [
      "Human Resources",
      "Finance",
      "Marketing",
      "Sales",
      "Operations",
      "Information Technology",
      "Customer Service",
      "Research and Development (R&D)",
      "Legal",
      "Software Development",
    ],
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
    enum: ["Internship", "contract", "full time", "part time"],
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
    data: { type: String },
    date: { type: Date },
  },
  cv: {
    data: { type: String },
    date: { type: Date },
  },
  relievingLetter: {
    data: { type: String },
    date: { type: Date },
  },
  bankDetails: {
    data: { type: String },
    date: { type: Date },
  },
  aadharCard: {
    data: { type: String },
    date: { type: Date },
  },
  postalAddress: {
    data: { type: String },
    date: { type: Date },
  },
  permanentAddress: {
    data: { type: String },
    date: { type: Date },
  },
  offerAcceptance: {
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
  },
  documentsSubmitted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
