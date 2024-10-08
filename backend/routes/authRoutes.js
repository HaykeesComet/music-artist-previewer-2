const express = require('express');
const { signup, login } = require('../controllers/authController'); // Import auth controller functions
const verifyToken = require('../middleware/authMiddleware');  // Middleware to verify JWT token

const router = express.Router();

router.post('/signup', signup); // Route for user signup
router.post('/login', login); // Route for user login

// Protected route to get the authenticated user's data
router.get('/user', verifyToken, (req, res) => {
  res.json(req.user);  // Respond with the user info from the JWT token
});

module.exports = router; // Export the router
