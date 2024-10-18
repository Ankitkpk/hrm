const { Notification } = require("../models/notifications.model");
const createNotificationUtil = require("../utils/notification");

// Controller to create a notification
const createNotification = async (req, res) => {
  try {
    const response = await createNotificationUtil(req.body); // Call the utility function with req.body
    // Send the response back to the client
    return res.status(response.status).json({
      message: response.message,
      notification: response.notification || null,
    });
    
  } catch (error) {
    console.error("Error in controller:", error); // Log error for debugging
    return res.status(500).json({ message: "Server error" });
  }
};


// Controller to get notifications for a user
const getNotificationsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find notifications for the specified user
    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });

    // Respond with the list of notifications
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    // Find the notification by ID and update the `isRead` field
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true } // Return the updated document
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Respond with the updated notification
    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to delete a notification
const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    // Find and delete the notification by ID
    const result = await Notification.findByIdAndDelete(notificationId);

    if (!result) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createNotification,
  getNotificationsForUser,
  markNotificationAsRead,
  deleteNotification,
};
