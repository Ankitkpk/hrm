const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/eventModel'); // Assuming your model is saved in './models/event'
const app = express();

// POST API to create a new event
const createEvent= async (req, res) => {
    try {
      const { eventTitle, eventDescription, eventDate, startTime, location, organizer, category } = req.body;
  
      // Create a new event
      const event = new Event({
        eventTitle,
        eventDescription,
        eventDate,
        startTime,
        location,
        organizer,
        category
      });
  
      // Save the event to the database
      const savedEvent = await event.save();
  
      return res.status(201).json(savedEvent);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  // GET API to retrieve all events
  const getEvent= async (req, res) => {
    try {
      const events = await Event.find();
      return res.status(200).json(events);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  const updateEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const { eventTitle, eventDescription, eventDate, startTime, location, organizer, category } = req.body;

      if(!eventTitle && !eventDescription && !eventDate && !startTime && !location && !organizer && !category){
        res.status(402).json({message:"At least one field is required to update:eventTitle, eventDescription, eventDate, startTime, location, organizer or category "})
      }

  
      // Find and update the event with new details
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        {
          eventTitle,
          eventDescription,
          eventDate,
          startTime,
          location,
          organizer,
          category
        },
        { new: true } // Returns the updated document
      );
  
      // If event not found, send a 404 response
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      return res.status(200).json(updatedEvent);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  module.exports = {
   getEvent,
   createEvent,
   updateEvent
}