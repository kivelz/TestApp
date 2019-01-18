const Review = require('../models/review')
const Service = require('../models/services')
const User = require('../models/user');


module.exports = {
	errorHandler: (fn) =>
		(req, res, next) => {
			Promise.resolve(fn(req, res, next))
						 .catch(next);
		},
	isReviewAuthor: async (req, res, next) => {
		let review = await Review.findById(req.params.review_id);
		if(review.author.equals(req.user._id) || req.user.isAdmin) {
			return next();
		}
		req.session.error = "You don't have the permission to do that";
		return res.redirect("/");
	}, 
	isServiceAuthor: async (req, res, next) => {
		let service = await Service.findById(req.params.id);
	
		if(service.author.id.equals(req.user._id) || req.user.isAdmin)  {
			return next();
		}
		req.flash('error', "You don't have the permission to do that");
		return res.redirect("/");
		},
		isLoggedIn: (req, res, next) => {
			// if user is authenticated in the session, carry on 
			if (req.isAuthenticated()) return next();
			if (!req.isAuthenticated()) {
				req.flash("error", "Please Login/Signup First");
				res.redirect("/users/login")
			}
	},
	isAuthenticated: (req, res, next) => {
		if(req.isAuthenticated()) {
			req.flash("error", "You are already Logged in")
			res.redirect("/services")
		} else {
			return next();
		}
	},
	isAdmin: async (req, res, next) => {
		if(req.isAuthenticated) {
		await User.find({});
		if(req.user.isAdmin){
			return next();
			}
		}
		req.flash("error", "Only Admins Allowed. Now Scram!!")
		res.redirect("/");
	}, 
	isUser: async(req, res, next) => {
		if(req.isAuthenticated) {
			let user = await User.findById(req.params.id);
			if(user._id.equals(req.user.id) || req.user.isAdmin )
			return next();
		}
		req.flash("error", "You do not have the permission to do that");
		res.redirect("/");
	}
	
	
}