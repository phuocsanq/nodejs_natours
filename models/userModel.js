const crypto = require('crypto');
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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        require: [true, 'Please provide your password'],
        minlength: 8,
        select: false
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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
});

userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false }});
    next();
});

userSchema.methods.isCorrectPassword = async function(cadidatePassword, userPassword) {
    return await bcrypt.compare(cadidatePassword, userPassword);
};

userSchema.methods.isChangedPasswordAfter = function(JWTtimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = this.passwordChangedAt.getTime() / 1000;

        return JWTtimestamp < changedTimestamp;
    }

    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;