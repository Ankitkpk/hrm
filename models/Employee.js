const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  positionApplied: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  joiningDate: {
    type: Date,
    required: true
  },
  employmentType: {
    type: String,
    required: true
  },
  emergencyContact: {
    type: String,
    required: true
  },
  residentialAddress: {
    type: String,
    required: true
  },
  photo: {
    type: String,
  },
  documents: [
    {
      filePath: { type: String },
      fileType: { type: String }
    }
  ]
});

module.exports = mongoose.model('Employee2', employeeSchema);
