const Services = require('../models/services');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
const Review = require('../models/review')
const { cloudinary, storage} = require('../cloudinary');
const User = require('../models/user')
const Notification = require('../models/notifications')

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = {
    
    async getServices(req, res, next) {
        if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi'); 
  
        let services = await Services.paginate({$or: [{name: regex,}, {tags: regex}, {location: regex}]}, {page: req.query.page || 1,limit: 12, sort: '-_id'})
         services.page = Number(services.page);
        res.render('services/services', {services,  mapBoxToken})
        
    } else {
        let services = await Services.paginate({}, {
            page: req.query.page || 1,
            limit: 12,
            sort: '-_id'
        });
        services.page = Number(services.page);
        res.render('services/services', {services, mapBoxToken})
    }
    },
        newServices(req, res, next) {
        res.render('services/newservice') 
    },
    async createServices(req, res, next) {
        req.body.services.images = [];
        
       for(const file of req.files) {
         req.body.services.images.push({
             url: file.secure_url,
             public_id: file.public_id
         });
       }
       let response = await geocodingClient
		.forwardGeocode({
			query: req.body.services.location,
            limit: 1,
            
		})
        .send()
       
       req.body.services.description = req.sanitize(req.body.services.description)
       req.body.services.geometry = response.body.features[0].geometry;    
       req.body.services.author = {
       username: req.user.local.username || req.user.facebook.name,
       id: req.user._id,
       
      }

       let services = await Services.create(req.body.services);
       let user = await User.findById(req.user._id).populate('followers').exec();;
       if(!user.isAdmin) {
           services.isClaimed = true
           services.save();
       }
       let newNotification = {
        username: req.user.local.username,
        servicesId: services.id
      }
      for(const follower of user.followers) {
        let notification = await Notification.create(newNotification);
        follower.notifications.push(notification);
        follower.save();
      }
       services.properties.description = `<strong><a href="/services/${services._id}">${services.name}</a></strong><p>${services.location}</p><p>${services.tags}...</p>`
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
        }).exec()
        let reviews = await Review.count(req.params.id)
        const floorRating = services.calculateAvgRating();
		res.render('services/info', { services, reviews,  floorRating, mapBoxToken});
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
                // add images to services.images
                    services.images.push({
                    url: file.secure_url,
                    public_id: file.public_id
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
             services.geometry = response.body.features[0].geometry;
             services.location = req.body.services.location;
        }
        services.tel = req.body.services.tel
        services.email = req.body.services.email
         services.url = req.body.services.url   
         services.floorNo = req.body.services.floorNo
         services.unit  = req.body.services.unit
        services.description = req.sanitize(req.body.services.description)
        services.name = req.body.services.name;
        services.description = req.body.services.description;
        services.properties.description = `<strong><a href="/services/${services._id}">${services.name}</a></strong><p>${services.location}</p><p>${services.tags}...</p>`;
        
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