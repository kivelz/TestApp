const Services = require('../models/services');
const cloudinary = require('cloudinary');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });


cloudinary.config({
    cloudname: 'dlreimtak',
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = {
    async getServices(req, res, next) {
        let services = await Services.paginate({}, {
            page: req.query.page || 1,
            limit: 12,
            sort: ({createdAt: -1})
        });
       
        services.page = Number(services.page);
        res.render('services/services', {services, mapBoxToken})
    },
        newServices(req, res, next) {
        res.render('services/newservice') 
    },
    async createServices(req, res, next) {
        req.body.services.images = [];
       for(const file of req.files) {
         let image =  await cloudinary.v2.uploader.upload(file.path);
         req.body.services.images.push({
             url: image.secure_url,
             public_id: image.public_id
         });
       }
       let response = await geocodingClient
		.forwardGeocode({
			query: req.body.services.location,
            limit: 1,
            
		})
        .send()
        
     
       req.body.services.coordinates = response.body.features[0].geometry.coordinates
        
       req.body.services.author = {
       id: req.user._id,
       username: req.user.username
      }
    
       let services = await Services.create(req.body.services);
       services.tags = req.body.tags.split(',');
       
       services.save();
       
   
      
       res.redirect(`/services/${services.id}`);
    },

    async servicesInfo(req, res, next) {
		let services = await Services.findById(req.params.id).populate({
			path: 'reviews',
			options: { sort: { '_id': -1 } },
			populate: {
				path: 'author',
				model: 'User'
			}
        });
        const floorRating = services.calculateAvgRating();
		res.render('services/info', { services, floorRating, mapBoxToken});
	},
    async servicesEdit(req, res, next) {
        let services = await Services.findById(req.params.id);
        //services.tags = services.tags.join(',');
		res.render('services/edit', { services });
    },
    
    async serviceUpdate(req, res, next) {
        //fund the post by id
        let services = await Services.findById(req.params.id);
        // turn comma delimited string into an array of strings for tags and
        // assign it to services.tags array
        services.tags = req.body.services.tags.split(',');
        //check if there are any image for deletion
        if(req.body.deleteImages && req.body.deleteImages.length) {
            //assign deleteImages from req.body to its own variable
            let deleteImages = req.body.deleteImages;
            //loop over delete images
            for(const public_id of deleteImages) {
                //delete images from cloudinary
             await cloudinary.v2.uploader.destroy(public_id);
             for(const image of services.images) {
                 if(image.public_id === public_id) {
                     let index = services.images.indexOf(image);
                     services.images.splice(index, 1)
                 }
             }
            }
        }
        //check if any new images for upload
        if(req.files){
            for(const file of req.files) {
                let image =  await cloudinary.v2.uploader.upload(file.path);
                // add images to services.images
                    services.images.push({
                    url: image.secure_url,
                    public_id: image.public_id
                });
              }
        }
        //check if location was updated
        if(req.body.services.location !== services.location) {
        let response = await geocodingClient
		    .forwardGeocode({
			query: req.body.services.location,
            limit: 1,
            })
             .send();
             services.coordinates = response.body.features[0].geometry.coordinates;
             services.location = req.body.services.location;
        }
        services.name = req.body.services.name;
        services.description = req.body.services.description;
        
        services.save();
        //redirect
	
		res.redirect(`/services/${services.id}`);
    },
    async serviceDestroy(req, res, next) {
       let service = await Services.findByIdAndRemove(req.params.id);
        for(const image of service.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await service.remove();
		res.redirect('/services');
	}
}