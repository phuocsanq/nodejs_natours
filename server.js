const dotenv = require('dotenv');
dotenv.config({ path : './config.env' });

const app = require('./app');

// console.log(process.env);

const port = process.env.PORT;
app.listen(9000, () => {
    console.log(`App listening on port ${port}...`);
})