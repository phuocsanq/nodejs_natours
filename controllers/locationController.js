const Location = require('../models/locationModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const { translate } = require('bing-translate-api');

exports.createLocation = catchAsync(async (req, res, next) => { 
    const newLocation = await Location.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            location: newLocation
        }
    })
});

exports.getOptions = catchAsync(async (req, res, next) => { 
    const type = req.query.type;
    const startLocations = await Tour.distinct('startLocation.description');
    const startLocationObjs = startLocations.map(el => {
        return { value: el, label: el }
    })
    
    let data = {};
    if (type === 'domestic') {
        const domesticLocations = await Location.find({ country: { $eq: 'Việt Nam' }  });
        const domesticDestinationObjs = domesticLocations.map(el => {
            return { value: el.name, label: el.name }
        });

        data = {
        departures: startLocationObjs,
        destinations: domesticDestinationObjs         // name field of the location table
        };
    } else if (type === 'international') {
        const internationalLocations = await Location.distinct('country', { country: { $ne: 'Việt Nam' }  });
        const internationalDestinationObjs = internationalLocations.map(el => {
            return { value: el, label: el }
        });

        data = {
        departures: startLocationObjs,
        destinations: internationalDestinationObjs     // country field of the location table
        };
    }

    res.status(201).json({
        status: 'success',
        data
    })
});

// exports.translate = catchAsync(async (req, res, next) => { 
//     console.log('okkkkkk');
//     const { texts, to } = req.body;
//     console.log('-----', texts.split(',').length);
//     const results = await Promise.all(texts.map(text => translate(text, null, to)));
//     const translations = results.map(result => result.translation);
//     res.status(200).json({
//         status: 'success',
//         translations
//     })
    
// });

exports.translate = catchAsync(async (req, res, next) => {
    try {
        const { texts, to } = req.body;
        // Ghi nhật ký đầu vào
        // console.log('Received request for translation:', { texts, to });

        const results = await Promise.all(texts.map(async (text) => {
            try {
                const result = await translate(text, null, to);
                return result.translation;
            } catch (err) {
                console.error('Translation error for text:', text);
                // throw err; // throw lại lỗi để nó có thể được xử lý bởi Promise.all
                return text;
            }
        }));

        res.status(200).json({
            status: 'success',
            translations: results
        });
    } catch (error) {
        console.error('Error in translate endpoint:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
});

exports.checkLocations = catchAsync(async (req, res, next) => {
    let { country, provinces } = req.body;
  
    // If provinces is a string, parse it to an array
    if (typeof provinces === 'string') {
      provinces = JSON.parse(provinces);
    }
  
    const locationIds = await Promise.all(provinces.map(async (province) => {
      const existingLocation = await Location.findOne({
        name: province,
        country: country
      });
  
      if (existingLocation) {
        return existingLocation._id;
      } else {
        const newLocation = await Location.create({ name: province, country: country });
        return newLocation._id;
      }
    }));
  
    req.body.locations = locationIds;
    next();
});

// exports.translate = catchAsync(async (req, res, next) => {
//     try {
//         const { texts, to } = req.body;
//         // Ghi nhật ký đầu vào
//         console.log('Received request for translation:', { texts, to });

//         const results = await Promise.all(texts.map(async (text) => {
//             try {
//                 const result = await translate(text, null, to, true); // Thêm `true` để bật caching
//                 if (result.statusCode !== 200) {
//                     throw new Error(`Translation error for text: ${text}, Error: ${result.errorMessage}`);
//                 }
//                 return result.translation;
//             } catch (err) {
//                 console.error('Translation error for text:', text, err);
//                 return text; // Trả về văn bản gốc nếu có lỗi
//             }
//         }));

//         res.status(200).json({
//             status: 'success',
//             translations: results
//         });
//     } catch (error) {
//         console.error('Error in translate endpoint:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Internal Server Error',
//             error: error.message
//         });
//     }
// });


