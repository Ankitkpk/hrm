const mongoose = require("mongoose")


const meetingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
      }
    ],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
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
  