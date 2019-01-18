var Review = require("../models/review");
var Services = require("../models/services");
var User = require("../models/user.js");




var middlewareObj = {};
    middlewareObj.checkServicesOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Services.findById(req.params.id, function(err, foundService){
            if(err) {
                req.flash("error", "no users found")
                res.redirect("back");
            } else {
                console.log('foundservice',foundService)
                if(foundService.equals(req.user._id) || req.user.isAdmin) {
                 next();
                } else {
                    req.flash("error", "You cannot do that")
                    res.redirect("/services");
                }
            }
          }); 
    } else {
       res.redirect("/services");
    
    }
};
middlewareObj.checkUserOwnership = function(req, res, next) {
    if(req.isAuthenticated) {
        User.findById(req.params.id, function(err, foundUser){
            if(err) {
                req.flash("error", "User not found");
                res.redirect("/services");
              
                  } Services.find().where('author.id').equals(foundUser._id).exec(function(err, service){
                   if(err) {
                     req.flash("error", "User not found");
                     res.redirect("/services");
                  } else {
                 
                    if(foundUser._id.equals(req.user._id)  || req.user.isAdmin ) {
                      next();
                  }  else {
                      req.flash("error", {error: err.message})
                    res.redirect("/services")
                  }
            } 
        })
    })
     } else {
        res.redirect("/services");
    }
};

middlewareObj.isAdmin = (req, res, next) => {
    if(req.isAuthenticated) {
        User.find({}, function(err, foundUsers){
            if(err){
                req.flash("error", "You are not admin now scram!");
                res.redirect("/services");
            } else {
              
                if(req.user.isAdmin === true) {
                    next();
                } else {
                   
                    req.flash("error", "Sorry don't have the permission to do that");
                    res.redirect("/services");   
                }
             }        
        });
     } else {
        res.redirect("/services")
    }
};


middlewareObj.isNotAuthenticated = (req, res, next) => {
        if (req.isAuthenticated()) {
        req.flash('error', 'Sorry, but you are already logged in!');
        res.redirect('/users/login');
        } else {
        return next();
        }
  };

middlewareObj.isAuthenticated = function(req,res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First")
    res.redirect("/users/login");
};

middlewareObj.isVerified = function(req,res, next){
    User.findOne({ username: req.body.username }, function(err, user) {
        if (!user){  
        req.flash("error", "User name doesn't exist. Please sign up")
         return res.status(401).redirect("back");
    }
        
   // Make sure the user has been verified
     if (!user.isVerified) {
      req.flash("error", "User not verified please check your email for verfication")
     return res.status(401).redirect("/resend"); 
            }
     if(user.isVerified) return next();
     // Login successful, write token, and send back user
      res.redirect("/services");
        });
    
};



middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You do not have the permission to do that")
                    res.redirect("back")
                }
            }
        });
    } else {
        res.redirect("back");
    }
};


module.exports = middlewareObj