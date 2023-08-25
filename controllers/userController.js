const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

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

// exports.getUser = (req, res) => {
   
// }

// exports.createUser = (req, res) => {
    
// }

// exports.updateUser = (req, res) => {
   
// }

// exports.deleteUser = (req, res) => {
    
// }




