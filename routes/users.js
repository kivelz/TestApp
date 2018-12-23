const express = require('express');
const router = express.Router();
const middleware = require("../middleware");
const { errorHandler, isUser } = require('../middleware/error');
const { validateBody, schemas } = require('../helpers/routehelpers');
const async = require("async");
var crypto = require("crypto");
const User = require('../models/user');
const nodemailer = require('nodemailer');
const passport = require('passport')
const { getLogin, postLogin, getLogout, getRegister, userRegister, getUserProfilepublic, getProfile, getProfileEdit, 
    editProfile, getVerify, postVerify, resetPassword, getForgot, getReset, facebookOAuth, getTerms, getRegisterAdmin} = require("../controllers/users");


//register page
router.get('/register', errorHandler(getRegister));

router.post('/register', validateBody(schemas.authSchema), errorHandler(userRegister));

router.get('/register/admin', errorHandler(getRegisterAdmin))


router.get('/login', errorHandler(getLogin));

router.get('/forget', errorHandler(getForgot));

router.post('/forget', function(req, res, next) {
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          User.findOne({ 'local.email': req.body.email }, function(err, user) {
            if (!user) {
              req.flash('error', 'No account with that email address exists.');
              return res.redirect('/forgot');
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
        
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
              service: 'MAILGUN', 
              auth: {
                user: process.env.MAILGUN_USER,
                pass: process.env.MAILGUN_PW
              }
            });
            var mailOptions = {
              to: user.local.email,
              from: 'passwordreset@sgpetservices.com',
              subject: 'Node.js Password Reset',
              text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/users/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              console.log('mail sent');
              req.flash('success', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
              done(err, 'done');
            });
          }

    ], function(err) {
        if(err) return next(err);
        res.redirect('forget');
    });
});

router.get('/reset/:token', errorHandler(getReset));

router.post('/reset/:token', function(req, res) {
   
    async.waterfall([
	    (done) => {
	      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
	        if (!user) {
            console.log(user)
	          req.flash('error', 'Passwword reset token is invalid or has expired.');
	          return res.redirect('back');
	        } else if (req.body.password === req.body.confirm) {
              user.password = user.generateHash(req.body.password);
	            user.resetPasswordToken = undefined;
	            user.local.resetPasswordExpires = undefined;
	            user.save((err) => {
	              req.logIn(user, (err) => {
	                done(err, user);
	              });
	            });
	        } else {
	          req.flash("error", "Passwords do not match.");
	          return res.redirect('back');
            } 
        });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
              service: 'MAILGUN', 
              auth: {
                user: process.env.MAILGUN_USER,
                pass: process.env.MAILGUN_PW
              }
            });
            var mailOptions = {
              to: user.local.email,
              from: 'passwordconfirmation@sgpetservices.com',
              subject: 'Node.js Password Reset',
              text: 'dsadsdad' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              console.log('mail sent');
              req.flash('success', 'Password has been resetted');
              res.redirect('/services')
              return done;
              
	      });
	    }
	  ], (err) => {
	    res.redirect('/services');
	  });
	});
router.post('/reset', errorHandler(resetPassword));

router.get('/register/terms', errorHandler(getTerms));

router.post('/login', errorHandler(postLogin));

router.post('/oauth/facebook', passport.authenticate('facebookToken', { session: false }), facebookOAuth);

router.get('/verify', errorHandler(getVerify));

router.post('/verify', errorHandler(postVerify));

router.get('/logout', errorHandler(getLogout));

router.get('/profile/:id', errorHandler(getUserProfilepublic))
 
router.get('/profiler/:id', isUser, errorHandler(getProfile));

router.get('/profiler/:id/edit', isUser, errorHandler(getProfileEdit));
   
router.put('/profiler/:id', isUser, errorHandler(editProfile)); 


module.exports = router;