const express = require('express');
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController'); // Import favorite controller functions
const verifyToken = require('../middleware/authMiddleware');  // Middleware to verify JWT token

const router = express.Router();

router.get('/', verifyToken, getFavorites);  // Protected route to get user's favorites
router.post('/', verifyToken, addFavorite);  // Protected route to add a new favorite
router.delete('/:id', verifyToken, removeFavorite);  // Protected route to remove a favorite by its ID

module.exports = router; // Export the router
