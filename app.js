const express = require('express');
const connectDB = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');
const connectDB = require('./config/db');
// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Handles JSON payloads
app.use(express.urlencoded({ extended: true })); // Handles URL-encoded form data
app.use('/uploads', express.static('uploads'));// Make uploads publicly accessible

// Routes
app.use('/api/employees', employeeRoutes);

// Error handling
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
