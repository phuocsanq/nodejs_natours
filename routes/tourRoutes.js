const express = require('express');
const router = express.Router();

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

// router.param('id', tourController.checkID);         // param midlerware
router
    .route('/top-5-cheap')
    .get(tourController.aliasTours, tourController.getAllTours);
router
    .route('/tour-stats')
    .get(tourController.getTourStats);
router
    .route('/month-plan/:year')
    .get(tourController.getMonthlyPlan);
router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour);
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

// POST /tour/232333/reviews
router
    .route('/:tourId/reviews')
    .post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

module.exports = router;