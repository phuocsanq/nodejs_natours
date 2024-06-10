const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tourVersion: {
        type: mongoose.Schema.ObjectId,
        ref: 'tour_versions',
        required: [true, 'Booking must belong to a Tour!']
    },
    version: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a User!']
    },
    // price: {
    //     type: Number,
    //     require: [true, 'Booking must have a price.']
    // },
    quantity: {
        type: Number,
        require: [true, 'Booking must have a quantity.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
        // default: () => moment().tz('Asia/Ho_Chi_Minh').toDate()
        // default: () => {
        //     // Lấy thời gian hiện tại
        //     const now = new Date();
        //     // Lấy múi giờ hiện tại và cộng thêm chênh lệch múi giờ
        //     const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        //     return localTime;
        // }
    },
    active: {
        type: Boolean,
        default: true
        // select: false
    }
    // paid: {
    //     type: Boolean,
    //     default: true
    // }
});

// no index

// bookingSchema.pre(/^find/, function(next) {
//     this.populate('user').populate({
//         path: 'tour',
//         select: 'name'
//     });
//     next();
// });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
