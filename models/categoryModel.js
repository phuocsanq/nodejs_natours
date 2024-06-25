const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Một danh mục phải có tên'],
        unique: true,
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

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
