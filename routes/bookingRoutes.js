const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.get('/create-payment-link/:tourId/:quantity', authController.protect, bookingController.createPaymentLink);
router.get('/:userId/bookings', authController.protect, bookingController.getToursBookedByUser);

module.exports = router;
