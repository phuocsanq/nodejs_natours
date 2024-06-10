const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//       const ext = file.mimetype.split('/')[1];
//       cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload any image.', 400), false)
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo')

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if(!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
});

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const feature = new APIFeatures(User.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();
        const users = await feature.query;
        // const users = await User.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        })
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);  
    if(!user) {
        return next(new AppError('No user found with that ID', 404));     // to global err handler
    }
        res.status(200).json({
            status: 'success',
            data: {
                user : user
            }
        })
});

exports.getMe = catchAsync(async (req, res, next) => {
    req.params.id = req.user.id;
    next();
});

exports.updateMe = catchAsync(async (req, res, next) => {    
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword'));
    }

    const filteredBody = filterObj(req.body, 'name', 'email');
    if(req.file) filteredBody.photo = req.file.filename;


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

exports.updateUser = catchAsync(async (req, res, next) => {
    // const user = await User.findOneAndUpdate({_id: req.params.id}, req.body, {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { 
        new: true,
        runValidators: true
    });
    if(!user) {
        return next(new AppError('No user found with that ID', 404));     // to global err handler
    }
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
});

exports.updateUserPassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('+password');
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    if(!user) {
        return next(new AppError('No user found with that ID', 404));     // to global err handler
    }
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    })
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) {
        return next(new AppError('No user found with that ID', 404));     // to global err handler
    }
        res.status(204).json({
            status: 'success',
            data: null
        })
});

exports.getAllGuides = catchAsync(async (req, res, next) => {
    const guides = await User.find({ role: 'guide' });
    
    res.status(200).json({
        status: 'success',
        data: {
            guides
        }
    })
});





