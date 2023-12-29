const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();

// Connect to MongoDB
try {
  mongoose.connect('mongodb+srv://findplaces:findplaces@findplaces.mgfwhbd.mongodb.net/findplaces');

  console.log('MongoDB connected successfully');
} catch (error) {
  console.error('MongoDB connection error:', error.message);
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', placesRoutes);

// Error handling middleware
app.use(errorHandler);

// Not-found handler
app.use(notFoundHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
