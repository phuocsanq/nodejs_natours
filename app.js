const mongoSanitize= require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// GLOBAL MIDDLEWARE
// set security http headers
app.use(helmet());

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Brute Force Attack
const limiter = rateLimit({
    max: 100,                 // Limit each IP to 100 requests per `window` (here, per 1 hour)
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP. Try again after an hour'
});
app.use('/api', limiter); // Apply the rate limiting middleware to API calls only

// Body parser, reading data from body into req.body
app.use(express.json());

// data sanitizaton against NoSQL query Injection
app.use(mongoSanitize());

// data sanitizaton against XSS
app.use(xss());

// serving static file
app.use(express.static(`${__dirname}/public`));   // because when we open up a URL that it can't find in any of our routes, it will then look in that public folder that we defined. And it sets that folder to the root.

// test middleware
app.use((req, res, next) => {                           
    console.log('Hello from the middleware!');
    next();
})
app.use((req, res, next) => {                           
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
})

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.statusCode = 404;
    // err.status = 'fail';
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
