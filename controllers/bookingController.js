const PayOS = require('@payos/node');
const Tour = require('../models/tourModel');
const mongoose = require('mongoose');
const TourVersion = mongoose.model('tour_versions');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const payOS = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.CHECKSUM_KEY);

exports.createPaymentLink = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);
    const quantity = req.params.quantity * 1;

    const body = {
        orderCode: Date.now(),  //
        amount: tour.price * (1 - tour.priceDiscount / 100) * quantity,
        description: "Thanh toan don hang",
        // buyerName: req.user.name,
        buyerEmail: req.user.email,
        items: [{
            name: `${tour.name}`,
            quantity,
            price: tour.price * (1 - tour.priceDiscount / 100)
        }],
            // cancelUrl: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}&quantity=${quantity}`,
            cancelUrl: `${req.protocol}://${req.get('host')}/tour/${tour.slug}/my-ticket/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}&quantity=${quantity}`,
            returnUrl: `${req.protocol}://${req.get('host')}/tour/${tour.slug}/bookingInfor`
            // đang hoán đổi url để tránh tốn giao dịch, hiển thị huỷ trong payos -> kệ
    };
      
        const paymentLinkRes = await payOS.createPaymentLink(body);
        // await payOS.getPaymentLinkInformation

        res.status(200).json({
            status: 'success',
            paymentLinkRes
        });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    const { tour, user, price, quantity } = req.query;
    
    if(!tour && !user && !price && !quantity) return next();
    // get tourVersionId by tourId
    const tourVersion = await TourVersion.findOne({ refId: tour });
    const tourVersionId = tourVersion.id;
    // Get the latest version of the tour
    const latestVersion = tourVersion.__v;
    const booking = await Booking.create({ 
        tourVersion: tourVersionId, 
        version: latestVersion, 
        user, 
        quantity 
    });
    // update current group size
    const mytour = await Tour.findById(tour);
    mytour.updateCurrentGroupSize(quantity);
    // send email
    const ticketURL = `${req.protocol}://${req.get('host')}/tour/${mytour.slug}/my-ticket`;
    const thisUser = {
        email: res.locals.user.email,
        name: res.locals.user.name,
    };
    const bookingInfor = {
        tourName: tourVersion.versions[latestVersion].name,
        startDate: tourVersion.versions[latestVersion].startDate,
        duration: tourVersion.versions[latestVersion].duration,
        price: tourVersion.versions[latestVersion].price,
        priceDiscount: tourVersion.versions[latestVersion].priceDiscount,
        quantity: booking.quantity,
        qrCode: booking.id.toUpperCase(),
        bookingDate: booking.createdAt
    };
    await new Email(thisUser, ticketURL, bookingInfor).sendTicket();
    
    
    // res.redirect(`${req.protocol}://${req.get('host')}/tour/${tour.slug}`);
    res.redirect(req.originalUrl.split('?')[0]);
});

exports.checkOverlapTours = catchAsync(async (req, res, next) => {
    // lúc này chắc chắn không đặt 1 tour 2 lần, chỉ cần kiểm tra trùng lịch các tour khác nhau
    // tìm tất cả các booking mà người này đã đặt trong booking
    const bookings = await Booking.find({ user: res.locals.user.id , active: { $eq: true } }).populate('tourVersion');
    if(!bookings || bookings.length === 0) return next();

    const bookedTours = bookings.map(el => {
        return el.tourVersion.versions[el.version]
    })

    // tìm tour hiện tại muốn book
    const tourToBook = await Tour.findOne({ slug: req.params.slug });
    // console.log(currentTour.startDate.getTime());
    const bookedTourObjects = bookedTours.map(bookedTour => {
        const start = bookedTour.startDate.getTime();
        const end = start + ((bookedTour.duration - 1) * 24 * 60 * 60 * 1000);
        return { start, end };
    });
    const tourToBookObject = {
        start : tourToBook.startDate.getTime(),
        end : tourToBook.startDate.getTime() + ((tourToBook.duration - 1) * 24 * 60 * 60 * 1000)
    }
    // console.log(bookedTourObjects); // []
    // console.log(tourToBookObject);  // phần tử
    // check overlap
    if(bookedTourObjects.length > 1) { 
        if(areManyDateTimeRangesOverlapping(tourToBookObject, bookedTourObjects)) {
            // message = 'If you try to book a tour, please note that it clashes with your existing bookings. Please consider booking at a different time slot or choose another tour. Thank you!';
            message = 'Nếu bạn cố gắng đặt tour này, lưu ý rằng lịch đặt tour này trùng với các tour đã đặt trước của bạn. Vui lòng cân nhắc đặt tour này ở khung giờ khác hoặc chọn một tour khác. Cảm ơn bạn!'
            return next(new AppError(message, 400));  // go to global handler
            // console.log(message);
            // return 1;
        } else {
            // console.log('booking successful');
            // return 1;
            return next();
        }
    } else {
        if(areTwoDateTimeRangesOverlapping(tourToBookObject, bookedTourObjects[0])) {
            // message = 'If you try to book a tour, please note that it clashes with your existing bookings. Please consider booking at a different time slot or choose another tour. Thank you!';
            message = 'Nếu bạn cố gắng đặt tour này, lưu ý rằng lịch đặt tour này trùng với các tour đã đặt trước của bạn. Vui lòng cân nhắc đặt tour này ở khung giờ khác hoặc chọn một tour khác. Cảm ơn bạn!'
            return next(new AppError(message, 400));
            // console.log(message);
            // return 1;
        } else {
            // console.log('booking successful');
            // return 1;
            return next();
        }
    }
    next(); 
});
// đang so sánh không lấy giờ nên có dấu =, nhưng trong DB có giờ
const areTwoDateTimeRangesOverlapping = (incommingDateTimeRange, existingDateTimeRange) => {
    return incommingDateTimeRange.start <= existingDateTimeRange.end && incommingDateTimeRange.end >= existingDateTimeRange.start
};

const areManyDateTimeRangesOverlapping = (incommingDateTimeRange, existingDateTimeRanges) => {
    return existingDateTimeRanges.some((existingDateTimeRange) => areTwoDateTimeRangesOverlapping(incommingDateTimeRange, existingDateTimeRange))
};

exports.getToursBookedByUser = catchAsync(async (req, res, next) => { 
    const bookings = await Booking.find({ user: req.params.userId, active: { $eq: true } }).populate('tourVersion');
    const bookedTourIds = bookings.map(el => {
        return el.tourVersion.refId;
    });

    const tours = await Tour.find({ _id: { $in: bookedTourIds } });

    res.status(200).json({
        status: 'success',
        tours
    });
});


exports.deleteBooking = catchAsync(async (req, res, next) => {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if(!booking) {
        return next(new AppError('No booking found with that ID', 404));    
    }

    res.status(200).json({
        status: 'success',
        data: null
    })
});