const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router({mergeParams: true}); // each router only have access to params of their specific routes

// GET  /tour/232333/reviews
// GET  /reviews
// POST /tour/232333/reviews
// POST /reviews
router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview);

module.exports = router;
