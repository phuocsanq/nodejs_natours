const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path : './config.env' });

// process.on('uncaughtException', err => {
//     console.log(err.name, err.message);
//     console.log('UNCAUGHT EXCEPTION 💥');
//     process.exit(1);
// })
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB)
    .then(() => console.log('DB connection successful!'));

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION 💥');
    server.close(() => {
        process.exit(1);
    })
});
