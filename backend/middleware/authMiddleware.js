const jwt = require('jsonwebtoken'); // Import JWT

// Middleware to verify JWT token for protected routes
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Extract the authorization header

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' }); // Return error if header is missing
  }

  const token = authHeader.split(' ')[1];  // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Token missing' }); // Return error if token is missing
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the JWT token
    req.user = decoded;  // Attach decoded user data to the request object
    next();  // Continue to the next middleware or controller
  } catch (error) {
    console.error('Token verification failed:', error);  // Log error
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken; // Export the middleware
