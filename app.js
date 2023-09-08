const path = require('path');
const hpp = require('hpp');
const mongoSanitize= require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const csp = require('helmet-csp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serving static file
app.use(express.static(path.join(__dirname, 'public')));   // because when we open up a URL that it can't find in any of our routes, it will then look in that public folder that we defined. And it sets that folder to the root.


// GLOBAL MIDDLEWARE
// set security http headers
// app.use(helmet({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));
// app.use(
//     helmet.contentSecurityPolicy({
//       useDefaults: true,
//       directives: {
//         "img-src": ["'self'", "https: data: blob:"],
//       },
//     })
//   );
// Sử dụng middleware helmet-csp để cấu hình CSP
// app.use(
//     csp({
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "'unsafe-inline'", 'example.com'],
//         // Thêm các directive khác theo cần thiết
//       },
//     })
//   );
// app.use(
//     csp({
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "'unsafe-inline'", 'https://example.com', "'unsafe-hashes'"],
//         // Thêm directive 'img-src' để cho phép tải hình ảnh từ 'https://tiles.stadiamaps.com'
//         // imgSrc: ["'self'", 'https://tiles.stadiamaps.com'],
//         "img-src": ["'self'", "https: data: blob:", "https://tiles.stadiamaps.com"],
//         // Thêm các directive khác theo nhu cầu
//         styleSrc: ["'self'", "'unsafe-inline'", "'unsafe-hashes'"], // Thêm 'unsafe-inline' cho style
//         fontSrc: ["'self'", 'https://fonts.gstatic.com'], // Thêm nguồn cho font
//       },
//     })
//   );

//   const corsOptions = {
//     origin: 'https://tiles.stadiamaps.com', // Cho phép truy cập từ trang web cụ thể
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được cho phép
//     credentials: true, // Cho phép gửi cookie và thông tin xác thực
//   };
// // Sử dụng middleware CORS
// app.use(cors(corsOptions));


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

// prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'maxGroupSize', 'difficulty', 'ratingsAverage', 'ratingsQuantity', 'price']
}));

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

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
