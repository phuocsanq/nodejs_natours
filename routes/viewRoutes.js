const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const bookingController = require('../controllers/bookingController');

router.get('/', authController.isLoggedIn, viewsController.getOverview); // bookingController.createBookingCheckout,
router.get('/search-tour', authController.isLoggedIn, viewsController.getSearchTourForm); 
router.get('/tour/:slug/booking-infor', authController.isLoggedIn, bookingController.checkOverlapTours, viewsController.getBookingInforForm);
router.get('/tour/:tourSlug/my-ticket', authController.protect, bookingController.createBookingCheckout, viewsController.getMyTicketForm);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-settings', authController.protect, viewsController.getMySettingForm);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.get('/my-bills', authController.protect, viewsController.getMyBills);
router.get('/requestResetEmail', authController.isLoggedIn, viewsController.getRequestResetEmailForm);
router.get('/resetPassword/:token', authController.isLoggedIn, viewsController.getResetPasswordForm);
router.get('/admin', authController.isLoggedIn, authController.restrictTo('admin'), viewsController.getAdminForm);
// router.get('/admin/tour', authController.isLoggedIn, authController.restrictTo('admin'), viewsController.getAdminTourForm);
// router.get('/admin/user', authController.isLoggedIn, authController.restrictTo('admin'), viewsController.getAdminUserForm);
router.get('/admin/user', authController.isLoggedIn, authController.restrictTo('admin'), viewsController.getAdminUserPage);
router.get('/admin/guide', authController.isLoggedIn, authController.restrictTo('admin'), viewsController.getAdminGuidePage);
router.get('/admin/tour', authController.isLoggedIn, authController.restrictTo('admin'), viewsController.getAdminTourPage);

module.exports = router;