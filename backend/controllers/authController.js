const pool = require('../db.js'); // Database connection pool
const bcrypt = require('bcrypt'); // Password hashing library
const jwt = require('jsonwebtoken'); // JWT for user authentication

// Sign-up controller to register a new user
exports.signup = async (req, res) => {
    const { email, password } = req.body; // Destructure email and password from request
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    try {
        // Insert user data into the users table and return the newly created user
        const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
        const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET); // Create a JWT for the user
        res.json({ user: result.rows[0], token }); // Respond with user data and JWT token
    } catch (error) {
        console.error('Signup error:', error); // Log error for debugging
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Login controller for authenticating existing users
exports.login = async (req, res) => {
    const { email, password } = req.body; // Destructure email and password from request

    try {
        // Find user by email in the database
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        // Compare the hashed password
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET); // Create JWT token if login is successful
            res.json({ user, token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' }); // Return error if credentials are invalid
        }
    } catch (error) {
        console.error('Login error:', error); // Log error for debugging
        res.status(500).json({ message: 'Error logging in', error });
    }
};
