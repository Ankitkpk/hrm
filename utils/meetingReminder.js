const moment = require('moment');
const createNotification  = require('../utils/notification');

const setReminder = (data) => {
    const { title, participants, startDate, startTime, location, agenda, companyId, reminder } = data;

    // Debug: Log the raw inputs
    console.log('Raw Inputs:', { startDate, startTime });

    // Extract the date from the ISO string to match the expected format
    const dateString = moment(startDate).format('YYYY-MM-DD');

    // Use 'hh:mm A' for AM/PM format
    const meetingTime = moment(`${dateString} ${startTime}`, 'YYYY-MM-DD hh:mm A', true); // Strict parsing

    // Debug: Log the parsed date and time
    // console.log('Parsed Meeting Time:', meetingTime.format());

    // // Validate the date and time
    // if (!meetingTime.isValid()) {
    //     console.error('Invalid date or time format detected.');
    //     throw new Error('Invalid date or time format. Please ensure the date is in YYYY-MM-DD and the time is in hh:mm AM/PM format.');
    // }

    // Convert reminder to an integer
    const reminderMinutes = parseInt(reminder, 10);
    if (isNaN(reminderMinutes) || reminderMinutes <= 0) {
        throw new Error('Invalid reminder value. It must be a positive number.');
    }

    // Subtract reminder minutes from the meeting time
    const reminderTime = meetingTime.clone().subtract(reminderMinutes, 'minutes');

    // Calculate the time difference from now to the reminder time
    const time = reminderTime.diff(moment());

    // if (time <= 0) {
    //     console.error("Reminder time is in the past. No notification will be created.");
    //     return;
    // }

    console.log(`Reminder will trigger in ${time / 1000} seconds.`);

    // Create the notification body
    const body = {
        title: `Reminder for ${title}`,
        message: `Meeting in ${reminderMinutes} minutes. Location: ${location}. Agenda: ${agenda}`,
        type: 'reminder',
        user: '670397af1ee0328002773230',  // Hardcoded user, replace with dynamic data if needed
        companyId: companyId,
        isRead: false
    };

    // Schedule the notification creation
    setTimeout(() => {
        createNotification(body);
    }, time);  // Trigger after the calculated time difference
};

module.exports = setReminder;
