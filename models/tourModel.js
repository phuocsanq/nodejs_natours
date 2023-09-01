const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        minlength: [10, 'A tour name must have more or equal 10 characters'],
        maxlength: [40, 'A tour name must have less or equal 40 characters']
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
        require: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type : Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        require: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
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
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
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
});

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'   // of user
    })
    next();
});

// AGGREGATE MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;