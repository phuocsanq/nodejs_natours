const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// MIDDLEWARE
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));   // because when we open up a URL that it can't find in any of our routes, it will then look in that public folder that we defined. And it sets that folder to the root.

app.use((req, res, next) => {                           // my middleware
    console.log('Hello from the middleware!');
    next();
})
app.use((req, res, next) => {                           // my middleware
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
