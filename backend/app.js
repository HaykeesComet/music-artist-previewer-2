require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const favoriteRoutes = require('./routes/favoriteRoutes'); // Routes for managing favorite tracks
const pool = require('./db.js'); // Import the PostgreSQL database pool connection

const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Registering routes
app.use('/api/auth', authRoutes); // User authentication routes (signup, login)
app.use('/api/favorites', favoriteRoutes); // Routes for favorite tracks

// Test the database connection at startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else if (process.env.NODE_ENV !== 'test') { // Suppress logs in test environment
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

// Start the server only if not in a test environment
if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000; // Default port to 5000
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app; // Export the app for use in other files (e.g., for testing)
