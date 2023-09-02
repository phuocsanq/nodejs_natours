const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router({mergeParams: true}); // each router only have access to params of their specific routes

// GET  /tour/232333/reviews
// GET  /reviews
// POST /tour/232333/reviews
// POST /reviews
router.use(authController.protect);
router 
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.restrictTo('user'), reviewController.createReview);

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
    .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;
