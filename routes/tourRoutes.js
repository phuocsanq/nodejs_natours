const express = require('express');
const router = express.Router();

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const locationController = require('../controllers/locationController');
const reviewRoutes = require('../routes/reviewRoutes');


// router.param('id', tourController.checkID);         // param midlerware

router.use('/:tourId/reviews', reviewRoutes);
    
router
    .route('/top-5-cheap')
    .get(tourController.aliasTours, tourController.getAllTours);
router
    .route('/tour-stats')
    .get(tourController.getTourStats);
router
    .route('/month-plan/:year')
    .get(authController.protect, authController.restrictTo('admin', 'guide'), tourController.getMonthlyPlan);
router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);
router
    .route('/distances/:latlng/unit/:unit')
    .get(tourController.getDistances);
router
    .route('/update-tour-status')
    .patch(tourController.updateTourStatus);
router
    .route('/thank-you-email')
    .post(tourController.thankYouEmail);
router
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restrictTo('admin'), tourController.uploadTourImages, tourController.resizeTourImages, locationController.checkLocations, tourController.createTour);
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect, authController.restrictTo('admin'), tourController.uploadTourImages, tourController.resizeTourImages, locationController.checkLocations, tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin'), tourController.deleteTour);

module.exports = router;