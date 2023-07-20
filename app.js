const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');

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

app.use('/api/v1/tours', tourRouter);

// ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTours)
// app.post('/api/v1/tours', createTour)
// app.get('/api/v1/tours/:id', getTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

// ROUTES


// START SERVER
app.listen(9000, () => {
    console.log('App listening on port 9000...');
})