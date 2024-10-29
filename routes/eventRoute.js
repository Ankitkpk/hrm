const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');


router.post("/createEvent", eventController.createEvent);
router.get("/getEvent", eventController.getEvent);
router.put("/updateEvent/:id", eventController.updateEvent);

module.exports = router ;