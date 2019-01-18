const Services = require('../models/services');
const Reviews = require('../models/review')


module.exports = {
    async landingPage(req, res, next) {
      
        let services = await Services.paginate({}, {
            page: req.query.page || 1,
            limit: 6,
            sort: '-_id'
        });
        let reviews = await Reviews.count({}).where('services._id').equals('review._id');
        res.render('landing', {services, reviews, mapBoxToken: process.env.MAPBOX_TOKEN});
       
    }
   
}
  
