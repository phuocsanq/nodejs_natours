const mongoose = require('mongoose');
const slugify = require('slugify');
const version = require('mongoose-version');
const { strategy } = require('sharp');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'A tour must have a name'],
        trim: true,
        minlength: [7, 'A tour name must have more or equal 7 characters'],
        maxlength: [40, 'A tour name must have less or equal 40 characters']
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'A tour must belong to a category']
    },
    slug : String,
    active: {
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
    currentGroupSize: {
        type: Number,
        default: 0,
        validate: {
            validator: function(val) {
                return val <= this.maxGroupSize;
            },
            message: 'Current group size ({VALUE}) should be below or equal to max group size'
        }
    },
    ratingsAverage: {
        type : Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10
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
        default: 0,
        validate: {
            validator: function(val) {
                return val < 100;
            },
            message: 'Discount rate ({VALUE}) should be below 100%'
        }
    },
    summary: {
        type: String,
        trim: true,
        require: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true,
        require: [true, 'A tour must have a description']
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
    startDate: Date,
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
            type: mongoose.Schema.ObjectId,
            ref: 'Location',
            required: [true, 'A tour must have at least one location']
        }
    ],
    itineraries: [
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
});

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere'});


// virtual populate - not save to DB
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',       // 'tour' field in reviewModel - where reference to here
    localField: '_id'
})

// DOCUMENTS MIDDLEWARE: runs before .save() and .create()
// tourSchema.pre('save', function(next) {
//     this.slug = slugify(this.name, {lower: true});
//     next();
// })
// tourSchema.pre('save', function(next) {
//     this.slug = this._id.toString();
//     next();
// });
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true }) + '-' + this._id;
    next();
});
// tourSchema.pre('save', function(next) {
//     console.log('Will save the document');
//     next();
// })

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// })
// QUERY MIDDLEWARE
// tourSchema.pre(/^find/, function(next) {
//     this.find({ secretTour: { $ne: true }});
//     next();
// });

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'   // of user
    })
    next();
});

// AGGREGATE MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//     this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
//     next();
// })

tourSchema.methods.updateCurrentGroupSize = async function(quantity) {
    // this: current Model
    this.currentGroupSize += quantity * 1;
    return this.save();
};

// tourSchema.plugin(version, { collection: 'tour_versions', strategy: 'collection' });  khong dung
tourSchema.plugin(version, { 
    collection: 'tour_versions', 
    suppressRefIdIndex: 'false', 
    suppressVersionIncrement: 'false',
    ignorePaths: ['currentGroupSize']
}); 
// tourSchema.plugin(version, { collection: 'tour_versions' }); giong nhu tren
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;