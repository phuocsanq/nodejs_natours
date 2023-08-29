const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

// exports.checkID = (req, res, next, val) => {
//     // const user = users.find(user => user.id === val * 1);
//     // if(!user) {
//     //     res.status(404).json({
//     //         status : 'fail',
//     //         message: 'Invalid ID'
//     //     })
//     // }
//     // next();
// }

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
});

exports.updateMe = catchAsync(async (req, res, next) => {
    
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword'));
    }

    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            updatedUser
        }
    })
    
});

















// exports.getUser = (req, res) => {
   
// }

// exports.createUser = (req, res) => {
    
// }

// exports.updateUser = (req, res) => {
   
// }

// exports.deleteUser = (req, res) => {
    
// }




