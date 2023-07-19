const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());
app.use((req, res, next) => {                           // my middleware
    console.log('Hello from the middleware!')
    next();
})
app.use((req, res, next) => {                           // my middleware
    req.requestTime = new Date().toISOString();
    next();
})
// app.get('/', (req, res) => {
//     res.status(200).send({message: 'Hello from the server!', app: 'Natours'});
// })
// app.post('/', (req, res) => {
//     res.status(200).send('You can post!');
// })
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));  // JS Object\

const getAllTours = (req, res) => {
    res.status(200).json({
        status : 'success',
        requestedAt: req.requestTime,
        results : tours.length,
        data : { tours }
    })
}
const creatTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id : newId }, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), err => {        // writeFile vì không blocking trong eventloop
        res.status(201).json({
            status : 'success',
            data : { tour : newTour}
        })
    })
}
const getTour = (req, res) => {
    const id = req.params.id * 1;  // string to number
    const tour = tours.find(el => el.id === id);
    if(!tour) {
     return res.status(404).json({
         status : 'fail',
         message : 'Invalid ID'
     })
    }
 
    res.status(200).json({
     status : 'success',
     data : {
         tour
     }
    })
}
const updateTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    if(!tour) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid Id'
        })
    }

    const updatedTour = { ...tour, ...req.body };   // spread 

    const updatedTours = tours.map(tour => 
        tour.id === updatedTour.id ? updatedTour : tour
    )

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(updatedTours, null, 2), err => {
        res.status(200).json({
            status: 'success',
            data : {updatedTour}
        })
    })
}
const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    if(!tour) {
        return res.status(404).json({
            status : 'fail',
            message : 'Invalid ID'
        })
    }
    const deletedTours = tours.filter(tour => tour.id != id);
    
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(deletedTours, null, 2), err => {
        res.status(204).json({
            status : 'success',
            data : null
        })
    })
}
// app.get('/api/v1/tours', getAllTours)
// app.post('/api/v1/tours', creatTour)
// app.get('/api/v1/tours/:id', getTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

app.route('/api/v1/tours').get(getAllTours).post(creatTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);


app.listen(9000, () => {
    console.log('App listening on port 9000...');
})