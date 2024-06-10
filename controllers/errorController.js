const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const value = err.keyValue.name;
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired. Please login again', 401);

const sendErrorDev = (err, req, res) => {
    // API
    if(req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    }

    // RENDER WEBSITE
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    })
}

const sendErrorProd = (err, req, res) => {
    // API
    if(req.originalUrl.startsWith('/api')) {
        // Operational, trusted error: send message to client
        if(err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        }
        // Programming or orther error unknow: don't leak error details
        // 1) Log error
        console.error('ERROR 💥', err);
        // 2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'something went very wrong!',
        })
    }

    // RENDER WEBSITE
    // Operational, trusted error: send message to client
    if(err.isOperational) {
        console.log(err);
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        })
    }
    // Programming or orther error unknow: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later'
    })   
}

module.exports = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if(process.env.NODE_ENV === 'production') {
        if(err.name === 'CastError') 
            err = handleCastErrorDB(err);
        else if(err.code === 11000) 
            err = handleDuplicateFieldsDB(err);
        else if(err.name === 'ValidationError') 
            err = handleValidationErrorDB(err);
        else if(err.name === 'JsonWebTokenError')
            err = handleJWTError();
        else if(err.name === 'TokenExpiredError')
            err = handleJWTExpiredError();
        sendErrorProd(err, req, res);    
    }
}