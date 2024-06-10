const mongoose = require('mongoose');

// hai phong, da nang, tokyo, sydney, bắc kinh  -> tỉnh, thành phố
const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A location must have a name'],
        unique: true,
        trim: true
    },
    country: {
        type: String,
        required: [true, 'A location must have a country'],
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
