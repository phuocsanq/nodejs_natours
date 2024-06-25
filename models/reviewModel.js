const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        require: [true, 'Review không được trống']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        require: [true, 'Review phải thuộc về một tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: [true, 'Review phải thuộc về một user']
    },
    createdAt: {
        type: Date,
        default: Date.now()
        // default: () => {
        //     // Lấy thời gian hiện tại
        //     const now = new Date();
        //     // Lấy múi giờ hiện tại và cộng thêm chênh lệch múi giờ
        //     const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        //     return localTime;
        // }
    }
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });  // Each user can only rate a maximum of 1 time per tour

reviewSchema.statics.calcRatingsAverage = async function(tourId) {
    const stats = await this.aggregate([             // this: current Model
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    // console.log(stats);

    if(stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
};

reviewSchema.post('save', function() {
    this.constructor.calcRatingsAverage(this.tour);   // this:              Specific object - is a review object that has been saved to the database. THIS here points to an entity of the review being saved.
                                                      // this.constructor:  reference to the constructor function of the review object (in this case, the Review model).
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
    // this.r = await this.findOne().clone();     // if want to execute a query twice use clone()
    // console.log('pre');
    // next();

    this.r = await this.model.findOne(this.getQuery()); //  getQuery() Returns the query condition that has been set in the current query.
    // console.log('THIS', this.getQuery());
    // console.log('THIS', this);
    next();
});
// this là query
// this.getQuery()  - { _id: '5c8a34ed14eb5c17645c9108' }    _id là id của document review
// mục tiêu là truy cập dc vào doc hiện tại, nhưng this lúc này là query hiện tại
// this.findOne() -> doc hiện tại
// this.r         -> doc hiện tại


reviewSchema.post(/^findOneAnd/, async function(doc) {
    await this.model.calcRatingsAverage(this.r.tour);   // this là query
    // await this.r.constructor.calcRatingsAverage(this.r.tour);   
});
// dùng post thì nếu calcRatingsAverage trong pre thì lúc này không truy cập vào query hiện tại dc nữa, vì query đã chạy xong


reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // });
    this.populate({
        path: 'user'
        // select: 'name photo'
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;