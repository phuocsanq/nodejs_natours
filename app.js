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
const cookieParser = require('cookie-parser');
const pug = require('pug');
const { createProxyMiddleware } = require('http-proxy-middleware');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const locationRouter = require('./routes/locationRoutes');

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

app.use(cookieParser());

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
    // console.log(req.cookies);
    next();
})
// Sử dụng middleware để thiết lập các biến cục bộ cho các mẫu
app.use((req, res, next) => {
    res.locals.pug = pug;
    next();
});


// ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/locations', locationRouter);
//////////
// app.get('/proxy/geonames', (req, res) => {
//     const { country, maxRows, username, featureCode } = req.query;
//     const options = {
//         hostname: 'api.geonames.org',
//         path: `/searchJSON?country=${country}&maxRows=${maxRows}&username=${username}&featureCode=${featureCode}`,
//         method: 'GET'
//     };

//     http.request(options, (apiRes) => {
//         let data = '';
//         apiRes.on('data', (chunk) => {
//         data += chunk;
//         });
//         apiRes.on('end', () => {
//         res.send(data);
//         });
//     }).end();
// });

// Thiết lập middleware proxy
// app.use('/proxy/geonames', createProxyMiddleware({
//     target: 'http://api.geonames.org',
//     changeOrigin: true,
//     pathRewrite: {
//       '^/proxy/geonames': '',
//     },
//     onProxyReq: (proxyReq, req, res) => {
//       proxyReq.path += `?country=${req.query.country}&maxRows=${req.query.maxRows}&username=sang&featureCode=ADM1`;
//     },
//   }));

// app.use('/proxy/geonames', createProxyMiddleware({
//     target: 'http://api.geonames.org',
//     changeOrigin: true,
//     pathRewrite: (path, req) => {
//         // Chuyển đổi đường dẫn yêu cầu để khớp với API Geonames
//         return path.replace('/proxy/geonames', '');
//     },
//     onProxyReq: (proxyReq, req, res) => {
//         // Thêm các tham số yêu cầu vào URL
//         const queryString = `?country=${req.query.country}&maxRows=${req.query.maxRows}&username=sang&featureCode=ADM1`;
//         proxyReq.path += queryString;
//     }
// }));
/////////

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
