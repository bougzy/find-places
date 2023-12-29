const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const authenticateUser = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.header('Authorization');

  // Check if token exists
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  // Extract the token without the "Bearer" prefix
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the environment variable
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Set the authenticated user in the request object
    req.user = decoded.user;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateUser;
