const express = require('express');
const app = express();
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// MIDDLEWARE
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));   // because when we open up a URL that it can't find in any of our routes, it will then look in that public folder that we defined. And it sets that folder to the root.

app.use((req, res, next) => {                           // my middleware
    console.log('Hello from the middleware!')
    next();
})
app.use((req, res, next) => {                           // my middleware
    req.requestTime = new Date().toISOString();
    next();
})

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


module.exports = app;

// START SERVER
