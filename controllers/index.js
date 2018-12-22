const Service = require('../models/services');

module.exports = {
    async landingPage(req, res, next) {
        const services = await Service.find({});
        res.render('landing', {services, mapBoxToken: process.env.MAPBOX_TOKEN});
    }
   
}
  
