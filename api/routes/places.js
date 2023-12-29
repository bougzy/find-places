// // routes/places.js

// const express = require('express');
// const { check } = require('express-validator');
// const placesController = require('../controllers/places');
// const authenticateUser = require('../middleware/auth');

// const router = express.Router();

// // Authentication route
// router.post(
//   '/register',
//   [
//     check('username').notEmpty().withMessage('Username is required'),
//     check('email').isEmail().withMessage('Invalid email format'),
//     check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//   ],
//   placesController.registerUser
// );

// router.post(
//   '/login',
//   [
//     check('username').notEmpty().withMessage('Username is required'),
//     check('password').notEmpty().withMessage('Password is required'),
//   ],
//   placesController.loginUser
// );

// // Place-related routes (require authentication)
// router.use(authenticateUser);

// router.post('/add', placesController.addPlace);

// router.post('/:placeId/comment', placesController.addComment);

// router.post('/:placeId/like', placesController.likePlace);

// router.post('/:placeId/rate', placesController.ratePlace);

// router.delete('/:placeId/comment/:commentId', placesController.deleteComment);

// router.delete('/:placeId', placesController.deletePlace);

// router.delete('/:placeId/events/:eventId', placesController.deleteEvent);

// router.put('/:placeId/comment/:commentId', placesController.editComment);

// router.put('/:placeId', placesController.editPlace);

// // User-related routes
// router.get('/user/profile', placesController.getUserProfile);

// router.get('/user/places', placesController.getUserPlaces);

// router.put('/user/profile', placesController.updateUserProfile);

// // Define other routes...

// module.exports = router;



// routes/places.js

const express = require('express');
const { check } = require('express-validator');
const placesController = require('../controllers/places');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// Authentication routes
router.post(
  '/register',
  [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  placesController.registerUser
);

router.post(
  '/login',
  [
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  placesController.loginUser
);

// Place-related routes (require authentication)
router.use(authenticateUser);

router.post('/add', placesController.addPlace);

router.post('/:placeId/comment', placesController.addComment);

router.post('/:placeId/like', placesController.likePlace);

router.post('/:placeId/rate', placesController.ratePlace);

router.delete('/:placeId/comment/:commentId', placesController.deleteComment);

router.delete('/:placeId', placesController.deletePlace);

router.delete('/:placeId/events/:eventId', placesController.deleteEvent);

router.put('/:placeId/comment/:commentId', placesController.editComment);

router.put('/:placeId', placesController.editPlace);

// User-related routes
router.get('/user/profile', placesController.getUserProfile);

router.get('/user/places', placesController.getUserPlaces);

router.put('/user/profile', placesController.updateUserProfile);

// Define other routes...

module.exports = router;
