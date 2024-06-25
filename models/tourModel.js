const mongoose = require('mongoose');
const slugify = require('slugify');
const version = require('mongoose-version');
const { strategy } = require('sharp');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Một tour du lịch phải có tên'],
        trim: true,
        minlength: [7, 'Tên tour du lịch phải có ít nhất 7 ký tự'],
        // maxlength: [60, 'Tên tour du lịch có tối đa 60 ký tự']
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Một tour du lịch phải thuộc về một danh mục']
    },
    slug : String,
    active: {
        type: Boolean,
        default: false
    },
    duration: {
        type: Number,
        require: [true, 'Một tour du lịch phải có thời lượng']
    },
    maxGroupSize: {
        type: Number,
        require: [true, 'Một tour du lịch phải có số lượng người tham gia tối đa']
    },
    currentGroupSize: {
        type: Number,
        default: 0,
        validate: {
            validator: function(val) {
                return val <= this.maxGroupSize;
            },
            message: 'Số lượng người tham gia hiện tại ({VALUE}) phải nhỏ hơn hoặc bằng số lượng người tham gia tối đa'
        }
    },
    ratingsAverage: {
        type : Number,
        default: 4.5,
        min: [1, 'Xếp hạng phải lớn hơn hoặc bằng 1.0'],
        max: [5, 'Xếp hạng không được vượt quá 5.0'],
        set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        require: [true, 'Một tour du lịch phải có giá']
    },
    priceDiscount: {
        type: Number,
        default: 0,
        validate: {
            validator: function(val) {
                return val < 100;
            },
            message: 'Tỷ lệ giảm giá ({VALUE}) phải nhỏ hơn 100%.'
        }
    },
    summary: {
        type: String,
        trim: true,
        require: [true, 'Một tour du lịch phải có tóm tắt']
    },
    description: {
        type: String,
        trim: true,
        require: [true, 'Một tour du lịch phải có mô tả']
    },
    imageCover: {
        type: String,
        require: [true, 'Một tour du lịch phải có ảnh bìa']
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
            required: [true, 'Một tour du lịch phải có ít nhất một địa điểm']
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