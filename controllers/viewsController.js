const QRCode = require('qrcode');
const User = require('../models/userModel');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const Location = require('../models/locationModel');
const Category = require('../models/categoryModel');
const Review = require('../models/reviewModel');
const mongoose = require('mongoose');
const TourVersion = mongoose.model('tour_versions');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const path = require('path');
const ObjectId = mongoose.Types.ObjectId;
// const Email = require('../utils/email');


exports.getOverview = catchAsync(async (req, res, next) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'Mạng bán tour trực tuyến',
        tours
    });
});

// exports.getSearchTourForm = catchAsync(async (req, res, next) => {
//     const type = req.query.type;
//     const category = req.query.category;
//     const departure = req.query.departure;
//     const destination = req.query.destination;
//     const startDate = req.query.startDate;
//     const amountDate = req.query.amountDate;  // 1-3, 4-7, 8-14, 15-30
//     const amountPerson = req.query.amountPerson; // 1, 2, 3-5, 6
//     const rangeprice = req.query.rangeprice;
//     const remainPax = req.query.remainPax;
//     const promotion = req.query.promotion;
//     const sort = req.query.sort;

    
//     // render list
//     const categoryList = await Category.distinct('name');
//     const departureList = await Tour.distinct('startLocation.description');
//     const destinationList = type === 'domestic' ? (await Location.find({ country: { $eq: 'Việt Nam' }  })).map(el => el.name) 
//     : await Location.distinct('country', { country: { $ne: 'Việt Nam' }  });
//     // render description
//     const locationDescription = type === 'domestic' ? (await Location.distinct('description', { name: destination })) 
//     : await Location.distinct('description', { country: destination  });
    
//     // console.log(new Date(startDate))     2024-05-28T00:00:00.000Z

//     const matchObject = {
//         'startDate': { $gte: new Date(startDate) }
//     };
//     const conditions = [];

//     if(departure) {
//         conditions.push({ 'startLocation.description': departure });
//     }

//     if(destination) {
//         conditions.push(type === 'domestic' ? { 'locationsDetails.name': destination } : { 'locationsDetails.country': destination });
//     } else {
//         conditions.push(type === 'domestic' ? { 'locationsDetails.country': { $eq: 'Việt Nam' } } : { 'locationsDetails.country': { $ne: 'Việt Nam' } });
//     }

//     if(amountDate) {
//         conditions.push({ duration: { $gte: amountDate.split('-')[0] * 1, $lte: amountDate.split('-')[1] * 1 } });
//     }

//     if(amountPerson) {
//         conditions.push(amountPerson.length == 1 ? { $expr: { $gte: [{ $subtract: ['$maxGroupSize', '$currentGroupSize'] }, amountPerson * 1] } } : { $expr: { $gte: [{ $subtract: ['$maxGroupSize', '$currentGroupSize'] }, amountPerson.split('-')[0] * 1] } });
//     }

//     if(rangeprice) {
//         conditions.push({
//             $expr: {
//                 $and: [
//                     { $gte: [{ $multiply: ['$price', { $subtract: [1, { $divide: ['$priceDiscount', 100] }] }] }, rangeprice.split('-')[0] * 1] },
//                     { $lte: [{ $multiply: ['$price', { $subtract: [1, { $divide: ['$priceDiscount', 100] }] }] }, rangeprice.split('-')[1] * 1] }
//                 ]
//             }
//         });
//     }   

//     if(remainPax) {
//         conditions.push({ $expr: { $gt: [{ $subtract: ['$maxGroupSize', '$currentGroupSize'] }, 0] } });
//     }

//     if(promotion) {
//         conditions.push({ priceDiscount: { $gt: 0 } });
//     }

//     if(conditions.length > 0) {
//         matchObject['$and'] = conditions;
//     }


//     const pipeline = [
//         {
//             $lookup: {
//                 from: 'locations', // Tên của collection mà bạn muốn join vào
//                 localField: 'locations', // Trường trong collection `Tour` chứa các ID tham chiếu
//                 foreignField: '_id', // Trường trong collection `Location` mà các ID tham chiếu đến
//                 as: 'locationsDetails' // Tên của trường mới chứa kết quả join
//             }
//         },  
//         {
//             $match: matchObject
//         }
//     ];

//     if(category) {
//         pipeline.push({
//             $lookup: {
//                 from: 'categories',
//                 localField: 'category',
//                 foreignField: '_id',
//                 as: 'categoryDetails'
//             }
//         });
//         pipeline.push({
//             $match: { 'categoryDetails.name': category }
//         });
//     }

//     if(sort) {
//         pipeline.push({
//             $addFields: {
//                 discountedPrice: { $multiply: ['$price', { $subtract: [1, { $divide: ['$priceDiscount', 100] }] }] }
//             }
//         });

//         let sortObject = {};
//         switch (sort) {
//             case 'priceAsc':
//                 sortObject = { discountedPrice: 1 };  
//                 break;
//             case 'priceDesc':
//                 sortObject = { discountedPrice: -1 }; 
//                 break;
//             case 'discount':
//                 sortObject = { priceDiscount: -1 }; 
//                 break;
//             default:
//                 sortObject = {}; 
//         }

//         if (Object.keys(sortObject).length > 0) {
//             pipeline.push({ $sort: sortObject });
//         }
//     }

//     const tours = await Tour.aggregate(pipeline);
  

//     res.status(200).render('overview-tour_search', {
//         title: `${(destination && departure) ? `Du lịch ${destination} khởi hành từ ${departure}` : `${destination ? `Du lịch ${destination}` : `${departure ? `Du lịch khởi hành từ ${departure}` : `Tất cả điểm đi và điểm đến`}`}`}`,
//         tours,
//         locationDescription,
//         category,
//         categoryList,
//         type,
//         departure,
//         departureList,
//         destination,
//         destinationList,
//         startDate,
//         amountDate,
//         amountPerson,
//         rangeprice,
//         remainPax,
//         promotion,
//         sort
//     });
// });


exports.getTour = catchAsync(async (req, res, next) => {
    // Get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
  
    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }

    // Check if the user has booked this tour or not
    let booking = null;
    // if logedin
    if(res.locals.user) {
        const tourVersion = await TourVersion.findOne({ refId: tour.id });

        booking = await Booking.findOne({ user: res.locals.user.id, tourVersion: tourVersion.id, active: { $eq: true } });  // active = true
    }

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
        booking
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Login to your account'
    });
};

exports.getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Create your account'
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    });
}

exports.getRequestResetEmailForm = (req, res) => {
    res.status(200).render('requestResetEmail', {
        title: 'Request reset email'
    });
}

exports.getResetPasswordForm = (req, res) => {
    res.status(200).render('resetPassword', {
        title: 'Reset Password'
    });
}

exports.getBookingInforForm = catchAsync(async (req, res) => {
    const tour = await Tour.findOne({ slug: req.params.slug })
    res.status(200).render('bookingInfor', {
        title: 'Booking information',
        tour
    });
    // console.log(tour)
});

exports.getMyTicketForm = catchAsync(async (req, res, next) => {
    // chính xác
    const tour = await Tour.findOne({ slug: req.params.tourSlug });
    const tourVersion = await TourVersion.findOne({ refId: tour.id });
    const booking = await Booking.findOne({ user: res.locals.user.id, tourVersion: tourVersion.id, active: { $eq: true } }).populate('tourVersion');
    const mytour = booking.tourVersion.versions[booking.version];
    // check if user enters url while not booking ticket
    if(!booking) {
        return next(new AppError('You do not have permission to perform this action.', 403));
    }
    
    res.status(200).render('myTicket', {
        title: 'My Ticket',
        tour: mytour,
        booking,
        qrCode: booking.id.toUpperCase()
    });
});

exports.getMySettingForm = (req, res) => {
    res.status(200).render('account_setting', {
        title: 'Settings',
        currentPath: '/my-settings'
    });
}

exports.getAdminForm = (req, res) => {
    res.status(200).render('admin', {
        title: 'Manager'
    });
}
exports.getReviewForm = async (req, res) => {
    const {userId, tourId, bookingId} = req.params;
    console.log(userId, tourId)

    let booking = null;
    if (mongoose.Types.ObjectId.isValid(bookingId)) {
        booking = await Booking.findById(bookingId);
    }

    const tourVersion = await TourVersion.find({ refId: tourId });

    const [bookingCount, reviewCount] = await Promise.all([
        Booking.countDocuments({ user: userId, tourVersion: tourVersion}),
        Review.countDocuments({ user: userId, tour: tourId })
    ])

    console.log('-------', bookingCount, reviewCount)

    res.status(200).render('review', {
        title: 'Review',
        userId,
        tourId,
        booking,
        bookingCount,
        reviewCount
    });
}



// NO USE
exports.getAdminUserForm = catchAsync(async (req, res) => {
    const skip = 0;
    const limit = 10;
    const users = await User.find().skip(skip).limit(limit);   // default

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    const pagination = {
        currentPage: 1,
        totalPages: totalPages,
        pages: Array.from({ length: totalPages }, (v, k) => k + 1)
    };
    
    res.status(200).render('admin_user', {
        title: 'Manager users',
        users,
        pagination
    });
});

//AJAX
// exports.getMyBills = catchAsync(async (req, res, next) => {
//     const bookings = await Booking.find({ user: req.user.id }).populate('tourVersion');
    
//     const objects = bookings.map(el => {
//         return {
//             tour: el.tourVersion.versions[el.version],
//             quantity: el.quantity,
//             createdAt: el.createdAt,
//             active: el.active
//         }
//     })
//     // // show Tour to see currentGroupSize
//     // const tours = await Tour.find({ _id: { $in: bookedTourIds } });

//     res.status(200).render('account_myBill', {
//         title: 'My Billing',
//         objects,
//         currentPath: '/my-bills'
//     });
// });

// exports.getMyTours = catchAsync(async (req, res, next) => {
//     const bookings = await Booking.find({ user: req.user.id, active: { $eq: true } }).populate('tourVersion');
//     const bookedTourIds = bookings.map(el => {
//         return el.tourVersion.refId;
//     })
//     // show Tour to see currentGroupSize
//     const tours = await Tour.find({ _id: { $in: bookedTourIds } });

//     res.status(200).render('account_myTour', {
//         title: 'My Tours',
//         tours,
//         currentPath: '/my-tours'
//     });
// });
exports.getMyTours = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({ user: req.user.id, active: { $eq: true } }).populate('tourVersion');
    const bookedTourIds = bookings.map(el => {
        return el.tourVersion.refId;
    });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.rowsPerPage) || 3;
    const skip = (page - 1) * limit;

    // show Tour to see currentGroupSize
    const tours = await Tour.find({ _id: { $in: bookedTourIds } }).skip(skip).limit(limit);
    const totalTours = await Tour.countDocuments({ _id: { $in: bookedTourIds } });

    const totalPages = Math.ceil(totalTours / limit);

    const pagination = {
        currentPage: page,
        totalPages: totalPages,
        pages: Array.from({ length: totalPages }, (v, k) => k + 1)
    };

    if(req.query.page && req.query.rowsPerPage) {
        res.status(200).json({
            userTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'mytour.pug'), { tours }),
            paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
        });
    }
    else {
        res.status(200).render('account_myTour', {
            title: 'My Tours',
            tours,
            currentPath: '/my-tours',
            pagination
        });
    }
});
// AJAX
exports.getMyBills = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.rowsPerPage) || 5;
    const skip = (page - 1) * limit;

    const [bookings, totalBookings] = await Promise.all([
        Booking.find({ user: req.user.id }).populate('tourVersion').skip(skip).limit(limit),
        Booking.countDocuments({ user: req.user.id })
    ]);

    const totalPages = Math.ceil(totalBookings / limit);

    const pagination = {
        currentPage: page,
        totalPages: totalPages,
        pages: Array.from({ length: totalPages }, (v, k) => k + 1)
    };
    
    const objects = bookings.map(el => {
        return {
            tour: el.tourVersion.versions[el.version],
            quantity: el.quantity,
            createdAt: el.createdAt,
            active: el.active
        }
    });

    if(req.query.page && req.query.rowsPerPage) {
        res.status(200).json({
            userTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'bill.pug'), { objects }),
            paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
        });
    }
    else {
        res.status(200).render('account_myBill', {
            title: 'My Billing',
            objects,
            pagination,
            currentPath: '/my-bills'
        });
    }
});


exports.getSearchTourForm = catchAsync(async (req, res, next) => {
    const type = req.query.type;
    const category = req.query.category;
    const departure = req.query.departure;
    const destination = req.query.destination;
    let startDate = req.query.startDate;
    const amountDate = req.query.amountDate;  // 1-3, 4-7, 8-14, 15-30
    const amountPerson = req.query.amountPerson; // 1, 2, 3-5, 6
    const rangeprice = req.query.rangeprice;
    const remainPax = req.query.remainPax;
    const promotion = req.query.promotion;
    const sort = req.query.sort;

    let currentDate = new Date(); // 2024-06-10T17:16:36.006Z

    // startDate.setHours(0, 0, 0, 0); // Đặt thời gian thành 00:00:00.000 để so sánh ngày

    if (new Date(startDate) < currentDate) {
        startDate = currentDate.toISOString().split('T')[0];
    }
    console.log(currentDate);
    console.log(startDate);

    
    // render list
    const categoryList = await Category.distinct('name');
    const departureList = await Tour.distinct('startLocation.description');
    const destinationList = type === 'domestic' ? (await Location.find({ country: { $eq: 'Việt Nam' }  })).map(el => el.name) 
    : await Location.distinct('country', { country: { $ne: 'Việt Nam' }  });
    // render description
    const locationDescription = type === 'domestic' ? (await Location.distinct('description', { name: destination })) 
    : await Location.distinct('description', { country: destination  });
    
    // console.log(new Date(startDate))     2024-05-28T00:00:00.000Z

    const matchObject = {
        'startDate': { $gte: new Date(startDate) }
    };
    const conditions = [{ active: true }];

    if(departure) {
        conditions.push({ 'startLocation.description': departure });
    }

    if(destination) {
        conditions.push(type === 'domestic' ? { 'locationsDetails.name': destination } : { 'locationsDetails.country': destination });
    } else {
        conditions.push(type === 'domestic' ? { 'locationsDetails.country': { $eq: 'Việt Nam' } } : { 'locationsDetails.country': { $ne: 'Việt Nam' } });
    }

    if(amountDate) {
        conditions.push({ duration: { $gte: amountDate.split('-')[0] * 1, $lte: amountDate.split('-')[1] * 1 } });
    }

    if(amountPerson) {
        conditions.push(amountPerson.length == 1 ? { $expr: { $gte: [{ $subtract: ['$maxGroupSize', '$currentGroupSize'] }, amountPerson * 1] } } : { $expr: { $gte: [{ $subtract: ['$maxGroupSize', '$currentGroupSize'] }, amountPerson.split('-')[0] * 1] } });
    }

    if(rangeprice) {
        conditions.push({
            $expr: {
                $and: [
                    { $gte: [{ $multiply: ['$price', { $subtract: [1, { $divide: ['$priceDiscount', 100] }] }] }, rangeprice.split('-')[0] * 1] },
                    { $lte: [{ $multiply: ['$price', { $subtract: [1, { $divide: ['$priceDiscount', 100] }] }] }, rangeprice.split('-')[1] * 1] }
                ]
            }
        });
    }   

    if(remainPax) {
        conditions.push({ $expr: { $gt: [{ $subtract: ['$maxGroupSize', '$currentGroupSize'] }, 0] } });
    }

    if(promotion) {
        conditions.push({ priceDiscount: { $gt: 0 } });
    }

    if(conditions.length > 0) {
        matchObject['$and'] = conditions;
    }


    const pipeline = [
        {
            $lookup: {
                from: 'locations', // Tên của collection mà bạn muốn join vào
                localField: 'locations', // Trường trong collection `Tour` chứa các ID tham chiếu
                foreignField: '_id', // Trường trong collection `Location` mà các ID tham chiếu đến
                as: 'locationsDetails' // Tên của trường mới chứa kết quả join
            }
        },  
        {
            $match: matchObject
        }
    ];

    if(category) {
        pipeline.push({
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryDetails'
            }
        });
        pipeline.push({
            $match: { 'categoryDetails.name': category }
        });
    }

    if(sort) {
        pipeline.push({
            $addFields: {
                discountedPrice: { $multiply: ['$price', { $subtract: [1, { $divide: ['$priceDiscount', 100] }] }] }
            }
        });

        let sortObject = {};
        switch (sort) {
            case 'priceAsc':
                sortObject = { discountedPrice: 1 };  
                break;
            case 'priceDesc':
                sortObject = { discountedPrice: -1 }; 
                break;
            case 'discount':
                sortObject = { priceDiscount: -1 }; 
                break;
            default:
                sortObject = {}; 
        }

        if (Object.keys(sortObject).length > 0) {
            pipeline.push({ $sort: sortObject });
        }
    }

    // const tours = await Tour.aggregate(pipeline);
  
    ////////////
    // const t = await Tour.aggregate(pipeline);
    // const totalTour = t.length;


    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.rowsPerPage) || 6;
    const skip = (page - 1) * limit;

    pipeline.push(
        {
            $facet: {
                paginatedResults: [
                    { $skip: skip },
                    { $limit: limit }
                ],
                totalCount: [
                    { $count: 'count' }
                ]
            }
        }
    );

    const results = await Tour.aggregate(pipeline);
    const tours = results[0].paginatedResults;
    const totalTour = results[0].totalCount[0] ? results[0].totalCount[0].count : 0;

    // const tours = await Tour.aggregate(pipeline);

    const totalPages = Math.ceil(totalTour / limit);

    const pagination = {
        currentPage: page,
        totalPages: totalPages,
        pages: Array.from({ length: totalPages }, (v, k) => k + 1)
    };

    if(req.query.page && req.query.rowsPerPage) {
        res.status(200).json({
            userTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'overview-tour_search.pug'), { tours }),
            paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
        });
    }
    else {
        // khác cũ overview-tour_search
        res.status(200).render('overview-tour', {
            title: `${(destination && departure) ? `Du lịch ${destination} khởi hành từ ${departure}` : `${destination ? `Du lịch ${destination}` : `${departure ? `Du lịch khởi hành từ ${departure}` : `Tất cả điểm đi và điểm đến`}`}`}`,
            tours,  // paginated
            totalTour,
            locationDescription,
            category,
            categoryList,
            type,
            departure,
            departureList,
            destination,
            destinationList,
            startDate,
            amountDate,
            amountPerson,
            rangeprice,
            remainPax,
            promotion,
            sort,
            pagination ///
        });
    }
});

// Thêm một route để phục vụ yêu cầu AJAX
// exports.getAdminUserPage = catchAsync(async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.rowsPerPage) || 10;
//     const skip = (page - 1) * limit;
    
//     const [users, totalUsers] = await Promise.all([
//         User.find().skip(skip).limit(limit),
//         User.countDocuments()
//     ]);

//     const totalPages = Math.ceil(totalUsers / limit);

//     const pagination = {
//         rowsPerPage: limit, //////
//         currentPage: page,
//         totalPages: totalPages,
//         pages: Array.from({ length: totalPages }, (v, k) => k + 1)
//     };

//     if(req.query.page && req.query.rowsPerPage) {
//         res.status(200).json({
//             userTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'userTable.pug'), { users, pagination}),
//             paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
//         });
//     }
//     else {
//         res.status(200).render('admin_user', {
//             title: 'Manager users',
//             users,
//             pagination,
//             currentPath: '/admin/user'
//         });
//     }
// });


// exports.getAdminUserPage = catchAsync(async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.rowsPerPage) || 10;
//     const skip = (page - 1) * limit;

//     const searchQuery = req.query.search ? {
//         name: { $regex: req.query.search, $options: 'i' } // Tìm kiếm tên gần đúng, không phân biệt chữ hoa chữ thường
//     } : {};

//     const [users, totalUsers] = await Promise.all([
//         User.find(searchQuery).skip(skip).limit(limit),
//         User.countDocuments(searchQuery) // Đếm số lượng người dùng dựa trên truy vấn tìm kiếm
//     ]);

//     const totalPages = Math.ceil(totalUsers / limit);

//     const pagination = {
//         rowsPerPage: limit,
//         currentPage: page,
//         totalPages: totalPages,
//         pages: Array.from({ length: totalPages }, (v, k) => k + 1)
//     };

//     if(req.query.page && req.query.rowsPerPage) {
//         res.status(200).json({
//             userTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'userTable.pug'), { users, pagination }),
//             paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
//         });
//     } else {
//         res.status(200).render('admin_user', {
//             title: 'Manager users',
//             users,
//             pagination,
//             currentPath: '/admin/user'
//         });
//     }
// });

// exports.getAdminUserPage = catchAsync(async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.rowsPerPage) || 10;
//     const skip = (page - 1) * limit;

//     let query = {};
//     if (req.query.search && req.query.search.trim() !== '') {
//         query = {
//             $or: [
//                 { name: { $regex: req.query.search.trim(), $options: 'i' } },
//                 { email: { $regex: req.query.search.trim(), $options: 'i' } }
//             ]
//         };
//     }


//     query.active = true; // for countDocuments
//     query.role = { $eq: 'user'}
//     console.log(query)

//     const [users, totalUsers] = await Promise.all([
//         User.find(query).skip(skip).limit(limit),
//         User.countDocuments(query)
//     ]);

//     // Fetch the bookings for each user
//     for(let user of users) {
//         const bookings = await Booking.find({ user: user._id, active: true }).lean();
//         user.bookings = bookings;
//     }

//     console.log(totalUsers)
//     const totalPages = Math.ceil(totalUsers / limit);

//     const pagination = {
//         rowsPerPage: limit,
//         currentPage: page,
//         totalPages: totalPages,
//         pages: Array.from({ length: totalPages }, (v, k) => k + 1)
//     };

//     if(req.query.page && req.query.rowsPerPage) {
//         res.status(200).json({
//             userTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'userTable.pug'), { users, pagination }),
//             paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
//         });
//     } else {
//         res.status(200).render('admin_user', {
//             title: 'Manager users',
//             users,
//             pagination,
//             currentPath: '/admin/user'
//         });
//     }
// });

exports.getAdminUserPage = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.rowsPerPage) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.search && req.query.search.trim() !== '') {
        query = {
            $or: [
                { name: { $regex: req.query.search.trim(), $options: 'i' } },
                { email: { $regex: req.query.search.trim(), $options: 'i' } }
            ]
        };
    }

    query.active = true; // for countDocuments
    query.role = { $eq: 'user' };
    console.log(query);

    const [totalUsers, usersWithBookings] = await Promise.all([ 
        User.countDocuments(query),
        User.aggregate([
            { $match: query },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'bookings', // the name of the bookings collection
                    let: { userId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $and: [{ $eq: ['$user', '$$userId'] }, { $eq: ['$active', true] }] } } }
                    ],
                    as: 'bookings'
                }
            }
        ])
    ])

    const totalPages = Math.ceil(totalUsers / limit);

    const pagination = {
        rowsPerPage: limit,
        currentPage: page,
        totalPages: totalPages,
        pages: Array.from({ length: totalPages }, (v, k) => k + 1)
    };

    if (req.query.page && req.query.rowsPerPage) {
        res.status(200).json({
            userTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'userTable.pug'), { users: usersWithBookings, pagination }),
            paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
        });
    } else {
        res.status(200).render('admin_user', {
            title: 'Manager users',
            users: usersWithBookings,
            pagination,
            currentPath: '/admin/user'
        });
    }
});

exports.getAdminGuidePage = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.rowsPerPage) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.search && req.query.search.trim() !== '') {
        query = {
            $or: [
                { name: { $regex: req.query.search.trim(), $options: 'i' } },
                { email: { $regex: req.query.search.trim(), $options: 'i' } }
            ]
        };
    }

    query.active = true; // for countDocuments
    query.role = { $eq: 'guide' };

    const [totalUsers, usersWithTours] = await Promise.all([ 
        User.countDocuments(query),
        User.aggregate([
            { $match: query },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'tours', // the name of the tours collection
                    let: { userId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $in: ['$$userId', '$guides'] } } }
                    ],
                    as: 'tours'
                }
            }
        ])
    ]);


    const totalPages = Math.ceil(totalUsers / limit);

    const pagination = {
        rowsPerPage: limit,
        currentPage: page,
        totalPages: totalPages,
        pages: Array.from({ length: totalPages }, (v, k) => k + 1)
    };

    if (req.query.page && req.query.rowsPerPage) {
        res.status(200).json({
            guideTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'guideTable.pug'), { users: usersWithTours, pagination }),
            paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
        });
    } else {
        res.status(200).render('admin_guide', {
            title: 'Manager guides',
            users: usersWithTours,
            pagination,
            currentPath: '/admin/guide'
        });
    }
});

exports.getAdminTourPage = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.rowsPerPage) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.search && req.query.search.trim() !== '') {
        query = {
            // $or: [
                 name: { $regex: req.query.search.trim(), $options: 'i' } 
                // { description: { $regex: req.query.search.trim(), $options: 'i' } }
            // ]
        };
    }

    const [tours, totalTours] = await Promise.all([
        Tour.find(query).populate('category').populate('locations').skip(skip).limit(limit),
        Tour.countDocuments(query)
    ]);

    // const totalTours = await Tour.countDocuments(query);

    // const tours = await Tour.find(query).populate('category').populate('locations')
    //     .skip(skip)
    //     .limit(limit);

    const totalPages = Math.ceil(totalTours / limit);

    const pagination = {
        rowsPerPage: limit,
        currentPage: page,
        totalPages: totalPages,
        pages: Array.from({ length: totalPages }, (v, k) => k + 1)
    };

    if (req.query.page && req.query.rowsPerPage) {
        res.status(200).json({
            tourTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'tourTable.pug'), { tours, pagination }),
            paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
        });
    } else {
        res.status(200).render('admin_tour', {
            title: 'Manager tours',
            tours,
            pagination,
            currentPath: '/admin/tour'
        });
    }
});

// exports.getAdminBookingPage = catchAsync(async (req, res, next) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.rowsPerPage) || 10;
//     const skip = (page - 1) * limit;

//     let query = {};
//     if (req.query.search && req.query.search.trim() !== '') {
//         console.log('///',req.query.search)
//         query = {
//             // $or: [
//                  'user.name': { $regex: req.query.search.trim(), $options: 'i' } 
//                 // { description: { $regex: req.query.search.trim(), $options: 'i' } }
//             // ]
//         };
//     }

//     const [bookings, totalBookings] = await Promise.all([
//         Booking.find(query).populate('tourVersion').populate('user').skip(skip).limit(limit),
//         Booking.countDocuments(query)
//     ]);

//     const totalPages = Math.ceil(totalBookings / limit);

//     const pagination = {
//         rowsPerPage: limit,
//         currentPage: page,
//         totalPages: totalPages,
//         pages: Array.from({ length: totalPages }, (v, k) => k + 1)
//     };
    
//     const objects = bookings.map(el => {
//         return {
//             id: el.id,
//             tour: el.tourVersion.versions[el.version],
//             user: el.user,
//             quantity: el.quantity,
//             createdAt: el.createdAt,
//             active: el.active
//         }
//     });

//     if(req.query.page && req.query.rowsPerPage) {
//         res.status(200).json({
//             bookingTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'bookingTable.pug'), { objects, pagination }),
//             paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
//         });
//     }
//     else {
//         res.status(200).render('admin_booking', {
//             title: 'Manager bookings',
//             objects,
//             pagination,
//             currentPath: '/admin/booking'
//         });
//     }
// });

// exports.getAdminBookingPage = catchAsync(async (req, res, next) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.rowsPerPage) || 10;
//     const skip = (page - 1) * limit;

//     let query = {};
//     if (req.query.search && req.query.search.trim() !== '') {
//         console.log('Search Query:', req.query.search);
//         query = {
//             'user.name': { $regex: req.query.search.trim(), $options: 'i' } 
//             // 'user.name': { $regex: new RegExp(req.query.search.trim(), 'i') }
//         };
//     }

//     const [bookings, totalBookings] = await Promise.all([
//         Booking.find(query).populate('tourVersion').populate('user').skip(skip).limit(limit),
//         Booking.countDocuments(query)
//     ]);

//     console.log('booking', bookings)

//     const totalPages = Math.ceil(totalBookings / limit);

//     const pagination = {
//         rowsPerPage: limit,
//         currentPage: page,
//         totalPages: totalPages,
//         pages: Array.from({ length: totalPages }, (v, k) => k + 1)
//     };
    
//     const objects = bookings.map(el => {
//         return {
//             id: el.id,
//             tour: el.tourVersion.versions[el.version],
//             user: el.user,
//             quantity: el.quantity,
//             createdAt: el.createdAt,
//             active: el.active
//         }
//     });

//     if(req.query.page && req.query.rowsPerPage) {
//         res.status(200).json({
//             bookingTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'bookingTable.pug'), { objects, pagination }),
//             paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
//         });
//     }
//     else {
//         res.status(200).render('admin_booking', {
//             title: 'Manager bookings',
//             objects,
//             pagination,
//             currentPath: '/admin/booking'
//         });
//     }
// });


// exports.getAdminBookingPage = catchAsync(async (req, res, next) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.rowsPerPage) || 10;
//     const skip = (page - 1) * limit;

//     let userQuery = {};
//     if (req.query.search && req.query.search.trim() !== '') {
//         userQuery = {
//             $or: [
//                 { name: { $regex: req.query.search.trim(), $options: 'i' } },
//                 { email: { $regex: req.query.search.trim(), $options: 'i' } }
//             ]
//         };
//     }

//     // Find matching users based on the search query
//     const matchingUsers = await User.find(userQuery, '_id').lean();
//     const matchingUserIds = matchingUsers.map(user => user._id);

//     let bookingQuery = {};
//     if (matchingUserIds.length > 0) {
//         bookingQuery = { user: { $in: matchingUserIds } };
//     }

//     const [bookings, totalBookings] = await Promise.all([
//         Booking.find(bookingQuery).populate('tourVersion').populate('user').skip(skip).limit(limit).lean(),
//         Booking.countDocuments(bookingQuery)
//     ]);

//     const totalPages = Math.ceil(totalBookings / limit);

//     const pagination = {
//         rowsPerPage: limit,
//         currentPage: page,
//         totalPages: totalPages,
//         pages: Array.from({ length: totalPages }, (v, k) => k + 1)
//     };
    
//     const objects = bookings.map(el => {
//         return {
//             id: el._id,
//             tour: el.tourVersion.versions[el.version],
//             user: el.user,
//             quantity: el.quantity,
//             createdAt: el.createdAt,
//             active: el.active
//         };
//     });

//     if (req.query.page && req.query.rowsPerPage) {
//         res.status(200).json({
//             bookingTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'bookingTable.pug'), { objects, pagination }),
//             paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
//         });
//     } else {
//         res.status(200).render('admin_booking', {
//             title: 'Manager bookings',
//             objects,
//             pagination,
//             currentPath: '/admin/booking'
//         });
//     }
// });


exports.getAdminBookingPage = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.rowsPerPage) || 10;
    const skip = (page - 1) * limit;

    let bookingQuery = {};
    let userQuery = {};

    if (req.query.search && req.query.search.trim() !== '') {
        const search = req.query.search.trim();
        let isObjectId = ObjectId.isValid(search);

        // query cho user
        userQuery = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        };

        // Tìm kiếm user khớp với điều kiện
        const matchingUsers = await User.find(userQuery, '_id').lean();
        const matchingUserIds = matchingUsers.map(user => user._id);

        // Xây dựng query cho booking
        bookingQuery = {
            $or: [
                { user: { $in: matchingUserIds } }
            ]
        };

        // Nếu search là ObjectId hợp lệ, thêm vào điều kiện tìm kiếm booking theo ID
        if (isObjectId) {
            bookingQuery.$or.push({ _id: new ObjectId(search) });
        }
    }

    const [bookings, totalBookings] = await Promise.all([
        Booking.find(bookingQuery).populate('tourVersion').populate('user').skip(skip).limit(limit).lean(),
        Booking.countDocuments(bookingQuery)
    ]);

    const totalPages = Math.ceil(totalBookings / limit);

    const pagination = {
        rowsPerPage: limit,
        currentPage: page,
        totalPages: totalPages,
        pages: Array.from({ length: totalPages }, (v, k) => k + 1)
    };

    const objects = bookings.map(el => {
        return {
            id: el._id,
            tour: el.tourVersion.versions[el.version],
            user: el.user,
            quantity: el.quantity,
            createdAt: el.createdAt,
            active: el.active
        };
    });

    if (req.query.page && req.query.rowsPerPage) {
        res.status(200).json({
            bookingTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'bookingTable.pug'), { objects, pagination }),
            paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
        });
    } else {
        res.status(200).render('admin_booking', {
            title: 'Manager bookings',
            objects,
            pagination,
            currentPath: '/admin/booking'
        });
    }
});


// exports.getAdminReviewPage = catchAsync(async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.rowsPerPage) || 10;
//     const skip = (page - 1) * limit;

//     let query = {};
//     if (req.query.search && req.query.search.trim() !== '') {
//         const searchRegex = { $regex: req.query.search.trim(), $options: 'i' };
//         query = {
//             $or: [
//                 { 'user.name': searchRegex },
//                 { 'user.email': searchRegex },
//                 { 'tour.name': searchRegex }
//             ]
//         };
//     }

//     const [reviews, totalReviews] = await Promise.all([
//         Review.find(query)
//             .populate('user')
//             .populate('tour')
//             .skip(skip)
//             .limit(limit),
//         Review.countDocuments(query)
//     ]);
//     console.log(reviews)

//     const totalPages = Math.ceil(totalReviews / limit);

//     const pagination = {
//         rowsPerPage: limit,
//         currentPage: page,
//         totalPages: totalPages,
//         pages: Array.from({ length: totalPages }, (v, k) => k + 1)
//     };

//     if (req.query.page && req.query.rowsPerPage) {
//         res.status(200).json({
//             reviewTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'reviewTable.pug'), { reviews, pagination }),
//             paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
//         });
//     } else {
//         res.status(200).render('admin_review', {
//             title: 'Manage Reviews',
//             reviews,
//             pagination,
//             currentPath: '/admin/review'
//         });
//     }
// });

exports.getAdminReviewPage = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.rowsPerPage) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.search && req.query.search.trim() !== '') {
        const searchRegex = { $regex: req.query.search.trim(), $options: 'i' };
        const users = await User.find({ $or: [{ name: searchRegex }, { email: searchRegex }] }).select('_id');
        const tours = await Tour.find({ name: searchRegex }).select('_id');

        const userIds = users.map(user => user._id);
        const tourIds = tours.map(tour => tour._id);

        query = {
            $or: [
                { user: { $in: userIds } },
                { tour: { $in: tourIds } }
            ]
        };
    }

    const [reviews, totalReviews] = await Promise.all([
        Review.find(query)
            .populate('user')
            .populate('tour')
            .skip(skip)
            .limit(limit),
        Review.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalReviews / limit);

    const pagination = {
        rowsPerPage: limit,
        currentPage: page,
        totalPages: totalPages,
        pages: Array.from({ length: totalPages }, (v, k) => k + 1)
    };

    if (req.query.page && req.query.rowsPerPage) {
        res.status(200).json({
            reviewTableHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'reviewTable.pug'), { reviews, pagination }),
            paginationHtml: res.locals.pug.renderFile(path.resolve(__dirname, '../', 'views', 'partials', 'pagination.pug'), { pagination })
        });
    } else {
        res.status(200).render('admin_review', {
            title: 'Manage Reviews',
            reviews,
            pagination,
            currentPath: '/admin/review'
        });
    }
});
