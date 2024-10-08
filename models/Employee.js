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
    required: true,
    unique:true
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
    type: String,
    required: true
  },
  joiningDate: {
    type: String,
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
  // documents: [
  //   {
  //     filePath: { type: String },
  //     fileType: { type: String }
  //   }
  // ]
  cv:{type:String},
  relievingLetter:{type:String},
  bankDetails:{type:String},
  passportPhotograph:{type:String},


});

module.exports = mongoose.model('Employee2', employeeSchema);
