const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'A tour must have a name'],
        unique: true,
        trim: true
    },
    slug : String,
    secretTour: {
        type: Boolean,
        default: false
    },
    duration: {
        type: Number,
        require: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        require: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        require: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
        type : Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        require: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        require: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        require: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
}, {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
});
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
})

// DOCUMENTS MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
})
// tourSchema.pre('save', function(next) {
//     console.log('Will save the document');
//     next();
// })

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// })
// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true }});
    next();
})
// AGGREGATE MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;