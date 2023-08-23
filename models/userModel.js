const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        require: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        require: [true, 'Please provide your password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Please confirm your password'],
        validate: {
            // this only works on CREATE and SAVE
            validator: function(vl) {
                return vl === this.password;
            },
            message: 'Password are not the same'
        }
    }
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);

module.exports = User;