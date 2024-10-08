const pool = require('../db.js'); // Database connection pool

// Fetch the user's favorite tracks
exports.getFavorites = async (req, res) => {
    const userId = req.user.id;  // Retrieve user ID from verified JWT token

    try {
        // Get all favorites for the logged-in user
        const result = await pool.query('SELECT * FROM favorites WHERE user_id = $1', [userId]);
        res.json(result.rows); // Send back the favorites in JSON format
    } catch (error) {
        console.error('Favorites fetching error:', error); // Log error
        res.status(500).json({ message: 'Error fetching favorites', error });
    }
};

// Add a new favorite track for the user
exports.addFavorite = async (req, res) => {
    const userId = req.user.id; // Retrieve user ID from the JWT token
    const { trackId, trackName, artistName, previewUrl, albumImage } = req.body; // Destructure track data from the request body

    try {
        // Insert the favorite track into the favorites table
        const result = await pool.query(
            'INSERT INTO favorites (user_id, track_id, track_name, artist_name, preview_url, album_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [userId, trackId, trackName, artistName, previewUrl, albumImage]
        );
        res.json(result.rows[0]); // Return the newly added favorite track
    } catch (error) {
        console.error('Error adding favorite:', error); // Log error
        res.status(500).json({ message: 'Error adding favorite', error });
    }
};

// Remove a favorite track for the user
exports.removeFavorite = async (req, res) => {
    const { id } = req.params; // Get favorite ID from the request parameters

    try {
        // Delete the favorite track from the favorites table
        const result = await pool.query('DELETE FROM favorites WHERE id = $1 RETURNING *', [id]);
        res.json(result.rows[0]); // Return the deleted favorite track
    } catch (error) {
        console.error('Error removing favorite:', error); // Log error
        res.status(500).json({ message: 'Error removing favorite', error });
    }
};
