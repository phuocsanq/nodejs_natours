const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        require: [true, 'Review can not be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        require: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: [true, 'Review must belong to a user']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

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
    // console.log(this.getQuery());
    next();
});

// reviewSchema.post(/^findOneAnd/, function() {
//     console.log('post');
// });

reviewSchema.post(/^findOneAnd/, async function(doc) {
    await this.model.calcRatingsAverage(this.r.tour); 
});

reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // });
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;