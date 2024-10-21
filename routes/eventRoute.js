const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');


router.post("/createEvent", eventController.createEvent);
router.get("/getEvent", eventController.getEvent);

module.exports = router ;