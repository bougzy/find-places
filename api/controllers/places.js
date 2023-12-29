




// controllers/places.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Place = require('../models/Place');
const User = require('../models/User');

// Place-related functions

exports.addPlace = async (req, res) => {
  try {
    const { name, description, images } = req.body;

    const place = new Place({
      name,
      description,
      images,
      user: req.user.id, // Associate the place with the authenticated user
    });

    await place.save();

    res.status(201).json({ message: 'Place added successfully', place });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { text } = req.body;

    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const newComment = {
      text,
      user: req.user.id,
    };

    place.comments.push(newComment);
    await place.save();

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.likePlace = async (req, res) => {
  try {
    const { placeId } = req.params;

    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    // Check if the user has already liked the place
    if (place.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already liked this place' });
    }

    place.likes.push(req.user.id);
    await place.save();

    res.status(200).json({ message: 'Place liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.ratePlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { rating } = req.body;

    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    // Check if the user has already rated the place
    const existingRating = place.ratings.find((r) => r.user.toString() === req.user.id);
    if (existingRating) {
      existingRating.value = rating;
    } else {
      place.ratings.push({ user: req.user.id, value: rating });
    }

    await place.save();

    res.status(200).json({ message: 'Place rated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { placeId, commentId } = req.params;

    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const comment = place.comments.find((c) => c.id === commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check if the logged-in user is the author of the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    // Remove the comment
    place.comments = place.comments.filter((c) => c.id !== commentId);
    await place.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const { placeId } = req.params;

    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    // Check if the logged-in user is the author of the place
    if (place.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this place' });
    }

    // Remove the place
    await place.remove();

    res.status(200).json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { placeId, eventId } = req.params;

    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const event = place.events.find((e) => e.id === eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if the logged-in user is the author of the event
    if (event.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }

    // Remove the event
    place.events = place.events.filter((e) => e.id !== eventId);
    await place.save();

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.editComment = async (req, res) => {
  try {
    const { placeId, commentId } = req.params;
    const { text } = req.body;

    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const comment = place.comments.find((c) => c.id === commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check if the logged-in user is the author of the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this comment' });
    }

    // Edit the comment
    comment.text = text;
    await place.save();

    res.status(200).json({ message: 'Comment edited successfully', comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.editPlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { name, description, images } = req.body;

    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    // Check if the logged-in user is the author of the place
    if (place.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this place' });
    }

    // Edit the place
    place.name = name;
    place.description = description;
    place.images = images;
    await place.save();

    res.status(200).json({ message: 'Place edited successfully', place });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// User-related functions

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
    }

    // Check if the username or email is already taken
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const field = existingUser.username === username ? 'username' : 'email';
      return res.status(400).json({ message: `${field} is already taken` });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ user: { id: newUser._id } }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ...

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
    }

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate a JWT token
    const token = jwt.sign({ user: { id: user._id } }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Send user details along with the token
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ...





exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUserPlaces = async (req, res) => {
  try {
    const places = await Place.find({ user: req.user.id });

    res.status(200).json({ places });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user profile
    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({ message: 'User profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Other controller functions...

module.exports = exports;

