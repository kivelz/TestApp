const Review = require('../models/review');
const Services = require('../models/services')

module.exports = {
 
    async reviewCreate(req, res, next) {
        let services = await Services.findById(req.params.id).populate('reviews').exec();
        let haveReviewed = services.reviews.filter(review=> {
            return review.author.equals(req.user._id);
        }).length;
        if(haveReviewed) {
            req.flash('error', 'Sorry You can only create one review per post');
            return res.redirect(`/services/${services.id}`)
        }
       //create review
        req.body.review.author = req.user._id;
        let review = await Review.create(req.body.review);
        

        services.reviews.push(review);
        services.save();
        res.redirect(`/services/${services.id}`)
           

        },
    async reviewUpdate(req, res, next) {
       await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
       res.redirect(`/services/${req.params.id}`)
    },

    async reviewDestroy(req,res, next) {
        await Services.findByIdAndUpdate(req.params.id, {
            $pull: { reviews: req.params.review_id }
        });
        
        res.redirect('/services');
    }
}