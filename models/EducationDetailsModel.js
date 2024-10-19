const mongoose = require("mongoose");


const EducationDetailsSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    programSelection: { type: String, enum: ["UG", "PG"], required: true },
    specialization: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    startingDate: { type: Date, required: true },
    address: { type: String, required: true },
    endingDate: { type: Date, required: true },
    city: { type: String, required: true },
    nomineeDetails: { type: String, required: true },
    pincode: { type: String, required: true },
    relation: { type: String, required: true },
    document: { type: String }, // For storing the file path or URL
    degree: { type: String },
    year: { type: String },
    institute: { type: String },
    grade: { type: String },
    hrmEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: "HRMEmployee" }, // Corrected to hrmEmployeeId
  },
  { timestamps: true }
);

const EducationDetails = mongoose.model("EducationDetails", EducationDetailsSchema);

module.exports = EducationDetails;