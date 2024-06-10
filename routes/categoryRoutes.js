const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router
    .route('/')
    .get(categoryController.getAllCategories)
    .post(categoryController.createCategory);

module.exports = router;
