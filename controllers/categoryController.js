const Category = require('../models/categoryModel');
const catchAsync = require('../utils/catchAsync');

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//     let filter = {};
//     if(req.params.tourId) filter = { tour: req.params.tourId };

//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: 'success',
//         results: reviews.length,
//         data: {
//             reviews
//         }
//     })
// });

// exports.getReview = catchAsync(async (req, res, next) => {
//     const review = await Review.findById(req.params.id);  
//     if(!review) {
//         return next(new AppError('No review found with that ID', 404));     // to global err handler
//     }
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 review : review
//             }
//         })
// });

exports.createCategory = catchAsync(async (req, res, next) => { 
    const newCategory = await Category.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            category: newCategory
        }
    })
});

exports.getAllCategories = catchAsync(async (req, res, next) => { 
    const categories = await Category.find();

    res.status(201).json({
        status: 'success',
        data: {
            categories
        }
    })
});
