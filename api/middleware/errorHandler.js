// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
 
    // Handle validation errors
    if (err.name === 'ValidationError') {
       statusCode = 400;
       const errors = Object.values(err.errors).map((error) => error.message);
       return res.status(statusCode).json({ message: 'Validation Error', errors });
    }
 
    // Handle authentication errors
    if (err.name === 'JsonWebTokenError') {
       statusCode = 401;
       return res.status(statusCode).json({ message: 'Invalid token' });
    }
 
    // Handle authorization errors
    if (err.name === 'TokenExpiredError') {
       statusCode = 401;
       return res.status(statusCode).json({ message: 'Token has expired' });
    }
 
    console.error(err.stack);
 
    res.status(statusCode).json({
       message: err.message,
       stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
 };
 
 module.exports = errorHandler;
 