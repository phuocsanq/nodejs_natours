const express = require('express');
const router = express.Router();

const tourController = require('../controllers/tourController');

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
    .get(tourController.getAllTours)
    .post(tourController.createTour);
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;