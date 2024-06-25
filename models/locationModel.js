const mongoose = require('mongoose');

// hai phong, da nang, tokyo, sydney, bắc kinh  -> tỉnh, thành phố
const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Một địa điểm phải có tên'],
        unique: true,
        trim: true
    },
    country: {
        type: String,
        required: [true, 'Một địa điểm phải có quốc gia'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
