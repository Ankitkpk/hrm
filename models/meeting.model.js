const mongoose = require("mongoose")


const meetingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    reminder:{
      type: Number,
      required: true, // Use Date type, but we will only manipulate minutes
    },
    participants: [
      {
        type: String,
        required: true
      }
    ],
    startDate: { type: Date, required: true },
    startTime:{type:String,required:true},
    location: { type: String },
    agenda: { type: String, trim: true },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
  }, {
    timestamps: true // Adds createdAt and updatedAt fields
  });
  
  const Meeting = mongoose.model('Meeting', meetingSchema);
  
  module.exports = Meeting;
  