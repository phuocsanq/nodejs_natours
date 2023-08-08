const Tour = require('./../models/tourModel');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));  // JS Object

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
        res.status(404).json({
            status : 'fail',
            message : 'Missing name or price'
        })
    }
    next();
}

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status : 'success',
        requestedAt: req.requestTime,
        // results : tours.length,
        // data : { tours }
    })
}
exports.createTour = (req, res) => {
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id : newId }, req.body);

    // tours.push(newTour);
    // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), err => {        // writeFile vì không blocking trong eventloop
    //     res.status(201).json({
    //         status : 'success',
    //         data : { tour : newTour}
    //     })
    // })
}
exports.getTour = (req, res) => {
    // const id = req.params.id * 1;  // string to number
    // const tour = tours.find(el => el.id === id);
    // console.log(id, tour)
    // res.status(200).json({
    //  status : 'success',
    //  data : {
    //      tour
    //  }
    // })
}
exports.updateTour = (req, res) => {
    // const id = req.params.id * 1;
    // const tour = tours.find(el => el.id === id);

    // const updatedTour = { ...tour, ...req.body };   // spread 

    // const updatedTours = tours.map(tour => 
    //     tour.id === updatedTour.id ? updatedTour : tour
    // )

    // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(updatedTours, null, 2), err => {
    //     res.status(200).json({
    //         status: 'success',
    //         data : {updatedTour}
    //     })
    // })
}
exports.deleteTour = (req, res) => {
    // const id = req.params.id * 1;

    // const deletedTours = tours.filter(tour => tour.id != id);
    
    // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(deletedTours, null, 2), err => {
    //     res.status(204).json({
    //         status : 'success',
    //         data : null
    //     })
    // })
}