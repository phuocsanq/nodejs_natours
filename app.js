const express = require('express');
const app = express();
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
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


// START SERVER
app.listen(9000, () => {
    console.log('App listening on port 9000...');
})