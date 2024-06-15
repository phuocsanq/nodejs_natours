const multer = require('multer');
const sharp = require('sharp');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');
const mongoose = require('mongoose');
const TourVersion = mongoose.model('tour_versions');
const Email = require('../utils/email');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);



// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeTourImages = catchAsync(async (req, res, next) => {
    // console.log('----------', req.body)
    // console.log('++++++++++', req.files.images)
 
    
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});


exports.aliasTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = catchAsync(async (req, res, next) => {
    const feature = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();
        const tours = await feature.query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours : tours
            }
        })
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate('reviews');  
    if(!tour) {
        return next(new AppError('No tour found with that ID', 404));     // to global err handler
    }
        res.status(200).json({
            status: 'success',
            data: {
                tour : tour
            }
        })
});
exports.updateTourStatus = catchAsync(async (req, res, next) => {
    // console.log(req.body)
    // console.log(req.body.active)
    const tour = await Tour.findByIdAndUpdate(req.body.id, { active: req.body.active }); 
    if(!tour) {
        return next(new AppError('No tour found with that ID', 404));     // to global err handler
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour : tour
        }
    })
});

exports.thankYouEmail = catchAsync(async (req, res, next) => {
    // reset booking and send email
    const tourId = req.body.tourId;

    const tourVersion = await TourVersion.findOne({ refId: tourId });
    const bookings = await Booking.find({ tourVersion : tourVersion.id , active: true }).populate('user');
    // const users = bookings.map(booking => booking.user);



    const emailPromises = bookings.map(booking => {
        const userId = booking.user._id;
        const bookingId = booking._id;
        const url = `${req.protocol}://${req.get('host')}/review/${userId}/${tourId}/${bookingId}`;
        return new Email(booking.user, url).sendThankYou();
    });

    await Promise.all(emailPromises);

    // reset booking
    await Booking.updateMany({ tourVersion: tourVersion.id, active: true }, { active: false });

    res.status(200).json({
        status: 'success'
    })
});













// exports.createTour = catchAsync(async (req, res, next) => {
//     console.log(req.body)
//     const newTour = await Tour.create(req.body);
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tour: newTour
//             }
//         })
// });

exports.createTour = catchAsync(async (req, res, next) => {
    // lưu đúng
    const tourTuTao = {
        startLocation: {
          description: "Miami, USA",
          type: "Point",
          coordinates: [-80.185942, 25.774772],
          address: "301 Biscayne Blvd, Miami, FL 33132, USA"
        },
        images: ["tour-2-1.jpg", "tour-2-2.jpg", "tour-2-3.jpg"],
        startDate:  "2024-06-19T09:00:00.000+00:00",
        name: "hehehehehe",
        category: "664b5634c81e7e9575e0d182",
        duration: 7,
        maxGroupSize: 15,
        guides: ["5c8a1f292f8fb814b56fa184", "5c8a21f22f8fb814b56fa18a"],
        price: 497,
        summary: "Exploring the jaw-dropping US east coast by foot and by boat",
        description: "Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\nIrure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        imageCover: "tour-2-cover.jpg",
        // location
        itineraries: [
            {
                day: 1,
                address: "địa chỉ ngày 1",
                coordinates: [
                    1111111111,
                    11111111111
                ],
                description: "mô tả hoạt động ngày 1"
            },
            {
                day: 2,
                address: "địa chỉ ngày 2",
                coordinates: [
                    2222222,
                    222222222222
                ],
                description: "mô tả hoạt động ngày 2"
            }
        ]
    }
    const formdata = {  // in ra
        "name": "test tour",
        "category": "664b5634c81e7e9575e0d182",
        "duration": "12",
        "maxGroupSize": "100",
        "price": "9999",
        "priceDiscount": "9",
        "summary": "ssummmmmmmmmmmmmmmm",
        "description": "desccccccccccccccccc",
        "imageCover": {
            "0": {}
        },
        "images": {
            "0": {},
            "1": {},
            "2": {}
        },
        "startDate": "2024-06-12",
        "startLocation": {
            "coordinates": "12,456",
            "address": "12 âu cơ",
            "description": "Đà Nẵng"
        },
        "guides": [
            "5c8a1f292f8fb814b56fa184",
            "5c8a21d02f8fb814b56fa189"
        ],
        "itineraries": [
            {
                "day": 1,
                "address": "địa chỉ ngày 1",
                "coordinates": [
                    1111111111,
                    11111111111
                ],
                "description": "dessssssssssssssssssssssssssssssssssssssssss"
            },
            {
                "day": 2,
                "address": "địa chỉ ngày 2",
                "coordinates": [
                    2222222,
                    222222222222
                ],
                "description": "sssssssssssssssssssssssssssssssssssssssss"
            }
        ]
    }


    const { name, category, duration, maxGroupSize, price, priceDiscount, summary, description, startDate, startLocation, guides, itineraries, imageCover, images, locations} = req.body;
    // Parse JSON strings back to objects
    const parsedStartLocation = JSON.parse(startLocation);
    const parsedGuides = JSON.parse(guides);
    const parsedItineraries = JSON.parse(itineraries)
    const newTour = {
        name, category, duration, maxGroupSize, price, priceDiscount, summary, description, startDate,
        startLocation: {
            type: 'Point',
            coordinates: parsedStartLocation.coordinates.split(',').map(Number),
            address: parsedStartLocation.address,
            description: parsedStartLocation.description
        },
        startDate: new Date(startDate),
        guides: parsedGuides,
        itineraries: parsedItineraries.map(itinerary => ({
            type: 'Point',
            coordinates: itinerary.coordinates.split(',').map(Number),
            address: itinerary.address,
            description: itinerary.description,
            day: itinerary.day
        })),
        imageCover,
        images,
        locations     
    }

    // console.log(newTour)
    console.log(JSON.stringify(newTour, null, 2));
    

    // body
    const body = {
        name: 'test tour',
        category: '664b5634c81e7e9575e0d182',
        duration: '12',
        maxGroupSize: '11',
        price: '9999',
        priceDiscount: '11',
        summary: '111111111111',
        description: '11111111111111',
        startDate: '2024-06-11',
        startLocation: '{"coordinates":"12,456","address":"12 âu cơ","description":"Bắc Giang"}',
        guides: '["5c8a1f292f8fb814b56fa184"]',
        itineraries: '[{"day":1,"address":"địa chỉ ngày 1","coordinates":[1111111111,11111111111],"description":"      222222222222222222222"}]',
        imageCover: 'tour-undefined-1717836386342-cover.jpeg',
        images: [
          'tour-undefined-1717836386548-1.jpeg',
          'tour-undefined-1717836386549-2.jpeg',
          'tour-undefined-1717836386549-3.jpeg'
        ]
      }
  
      await Tour.create(newTour);
  
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
});


exports.updateTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404)); // to global err handler
    }

    const { name, category, duration, maxGroupSize, price, priceDiscount, summary, description, startDate, startLocation, guides, itineraries, imageCover, images, locations} = req.body;
    // Parse JSON strings back to objects
    const parsedStartLocation = JSON.parse(startLocation);
    const parsedGuides = JSON.parse(guides);
    const parsedItineraries = JSON.parse(itineraries)

    const updateTour = {
        name, category, duration, maxGroupSize, price, priceDiscount, summary, description, startDate,
        startLocation: {
            type: 'Point',
            coordinates: parsedStartLocation.coordinates.split(',').map(Number),
            address: parsedStartLocation.address,
            description: parsedStartLocation.description
        },
        startDate: new Date(startDate),
        guides: parsedGuides,
        itineraries: parsedItineraries.map(itinerary => ({
            type: 'Point',
            coordinates: itinerary.coordinates.split(',').map(Number),
            address: itinerary.address,
            description: itinerary.description,
            day: itinerary.day
        })),
        // imageCover,
        // images,
        locations     
    }
   
    if (imageCover) {
        updateTour.imageCover = imageCover;
    }

    if (images) {
        updateTour.images = images;
    }

    console.log(updateTour)

    tour.set(updateTour);
    await tour.save();

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
});




exports.deleteTour = catchAsync(async (req, res, next) => {
    console.log('id req', req.params.id)
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour) {
        return next(new AppError('No tour found with that ID', 404));     // to global err handler
    }

    res.status(200).json({
        status: 'success',
        data: null
    })
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match : {ratingsAverage: { $gte: 4.5 }}
        },
        {
            $group: {
                _id: '$difficulty',
                numTours: {$sum: 1},
                numRating: {$sum: '$ratingsQuantity'},
                avgRating: {$avg: '$ratingsAverage'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'}
            }
        },
        {
            $sort: {avgPrice: 1}
        }
    ]);

    res.status(200).json({
        status: 'success',
        results: stats.length,
        data: {
            stats
        }
    })
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numTourStarts: {$sum: 1},
                    tours: {$push: '$name'}
                }
            },
            {
                $addFields: {month: '$_id'}
            },
            {
                $project: {_id: 0}
            },
            {
                $sort: {numTourStarts: -1}
            }
        ])

        res.status(200).json({
            status: 'success',
            results: plan.length,
            data: {
                plan
            }
        })
});
// tours-within/:distance/center/:latlng/unit/:unit
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if(!lat || !lng) {
        return next(new AppError('Pleas provide latitude and longtitude', 400));
    };

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }   // longitude first
    });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.00062137 : 0.001;

    if(!lat || !lng) {
        return next(new AppError('Pleas provide latitude and longtitude', 400));
    };

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            distances
        }
    })
});