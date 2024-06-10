const locationController = require('../controllers/locationController');
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router
    .route('/')
    .post(locationController.createLocation);
router 
    .route('/getOptions')
    .get(locationController.getOptions)
router 
    .route('/translate')
    .post(locationController.translate)
module.exports = router;
