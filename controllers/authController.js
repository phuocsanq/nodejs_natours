const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { decode } = require('punycode');

const signToken = id => {
    return jwt.sign({ id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfim: req.body.passwordConfim
    // });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne( { email: email }).select('+password');

    if(!user || !(await user.isCorrectPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    })
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token) {
        return next(new AppError('You are not logged in! Please log in to get access.'));
    }

    // 2) Verification token
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) check if user still exist
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new AppError('The user belonging to this token dose no longer exist', 401));
    }

    // 4) check if user changed password after the token was issued
    if(currentUser.isChangedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password. Please login again', 401));
    };

    req.user = currentUser;
        
    next();
})