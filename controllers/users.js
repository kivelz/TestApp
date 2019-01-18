const User = require('../models/user');
const Services = require('../models/services')
const passport = require('passport');
const randomstring =require('randomstring');
const cloudinary = require('cloudinary');
const nodemailer = require('nodemailer');
const Reviews = require('../models/review')
const async = require("async");
const crypto = require("crypto");
cloudinary.config({
  cloudname: 'dlreimtak',
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


module.exports = {
    
  getTerms: async(req, res, next)=> {
    res.render('terms');
  },
    getRegister: async(req, res, next)=> {
        res.render('auth/register');
    },
    getRegisterAdmin: async(req, res, next)=> {
        res.render('auth/registerAdmin')
    },
    userRegister: async(req, res, next) => {
      const secretToken = randomstring.generate();
   
      const { firstName, username, lastName,  images, password, confirmationPassword, email, gender} = req.value.body

      const foundUser = await User.findOne({ "local.email": email });
      if (foundUser) { 
        req.flash('error', "Email already existed");
        res.redirect('back')
        return;
      }
      
      const newUser = new User({
      
        local: {
        email,
        password,
        confirmationPassword,
        firstName,
        lastName,
        images,
        username, 
        secretToken, 
        gender
        }
      });
  
      
    if(req.file) {
        newUser.local.images =  await cloudinary.v2.uploader.upload(req.file.path);
        req.value.images = newUser.local.images.secure_url
        req.value.public_id = newUser.local.public_id
    } else {
       newUser.local.images = await cloudinary.v2.uploader.upload("public/images/overallblank.png");
       req.value.images = newUser.local.images.secure_url
        req.value.public_id = newUser.local.public_id
      
    }
      
      newUser.local.password = newUser.generateHash(password);

   
      delete req.value.confirmationPassword;
     
     
      if(req.body.adminCode === process.env.adminCode) {
       newUser.isAdmin = true;
     }
      await newUser.save();
    
     var smtpTransport = nodemailer.createTransport({ 
       service: 'hotmail',
       host: "smtp-mail.outlook.com", // hostname
       secureConnection: false, // TLS requires secureConnection to be false
       port: 587, // port for secure SMTP
       auth: {
           user: process.env.MAILGUN_USER,
           pass: process.env.MAILGUN_PW
       },
       tls: {
           ciphers:'SSLv3'
       }
   });
   var mailOptions = {
     to: newUser.local.email,
     from: 'administrator@singaporepetservices.com',
     subject: 'Email verification',
     html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
     <html xmlns="http://www.w3.org/1999/xhtml">
     <head>
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
       <title>Verify your email address</title>
       <style type="text/css" rel="stylesheet" media="all">
         /* Base ------------------------------ */
         *:not(br):not(tr):not(html) {
           font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
           -webkit-box-sizing: border-box;
           box-sizing: border-box;
         }
         body {
           width: 100% !important;
           height: 100%;
           margin: 0;
           line-height: 1.4;
           background-color: #F5F7F9;
           color: #839197;
           -webkit-text-size-adjust: none;
         }
         a {
           color: #414EF9;
         }
         /* Layout ------------------------------ */
         .email-wrapper {
           width: 100%;
           margin: 0;
           padding: 0;
           background-color: #F5F7F9;
         }
         .email-content {
           width: 100%;
           margin: 0;
           padding: 0;
         }
         /* Masthead ----------------------- */
         .email-masthead {
           padding: 25px 0;
           text-align: center;
         }
         .email-masthead_logo {
           max-width: 400px;
           border: 0;
         }
         .email-masthead_name {
           font-size: 32px;
           font-weight: bold;
           color: #839197;
           text-decoration: none;
           text-shadow: 0 1px 0 white;
         }
         /* Body ------------------------------ */
         .email-body {
           width: 100%;
           margin: 0;
           padding: 0;
           border-top: 1px solid #E7EAEC;
           border-bottom: 1px solid #E7EAEC;
           background-color: #FFFFFF;
         }
         .email-body_inner {
           width: 570px;
           margin: 0 auto;
           padding: 0;
         }
         .email-footer {
           width: 570px;
           margin: 0 auto;
           padding: 0;
           text-align: center;
         }
         .email-footer p {
           color: #839197;
         }
         .body-action {
           width: 100%;
           margin: 30px auto;
           padding: 0;
           text-align: center;
         }
         .body-sub {
           margin-top: 25px;
           padding-top: 25px;
           border-top: 1px solid #E7EAEC;
         }
         .content-cell {
           padding: 35px;
         }
         .align-right {
           text-align: right;
         }
         /* Type ------------------------------ */
         h1 {
           margin-top: 0;
           color: #292E31;
           font-size: 19px;
           font-weight: bold;
           text-align: left;
         }
         h2 {
           margin-top: 0;
           color: #292E31;
           font-size: 16px;
           font-weight: bold;
           text-align: left;
         }
         h3 {
           margin-top: 0;
           color: #292E31;
           font-size: 14px;
           font-weight: bold;
           text-align: left;
         }
         p {
           margin-top: 0;
           color: #839197;
           font-size: 16px;
           line-height: 1.5em;
           text-align: left;
         }
         p.sub {
           font-size: 12px;
         }
         p.center {
           text-align: center;
         }
         /* Buttons ------------------------------ */
         .button {
           display: inline-block;
           width: 200px;
           background-color: #414EF9;
           border-radius: 3px;
           color: #ffffff;
           font-size: 15px;
           line-height: 45px;
           text-align: center;
           text-decoration: none;
           -webkit-text-size-adjust: none;
           mso-hide: all;
         }
         .button--green {
           background-color: #28DB67;
         }
         .button--red {
           background-color: #FF3665;
         }
         .button--blue {
           background-color: #414EF9;
         }
         /*Media Queries ------------------------------ */
         @media only screen and (max-width: 600px) {
           .email-body_inner,
           .email-footer {
             width: 100% !important;
           }
         }
         @media only screen and (max-width: 500px) {
           .button {
             width: 100% !important;
           }
         }
       </style>
     </head>
     <body>
       <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
         <tr>
           <td align="center">
             <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
               <!-- Logo -->
               <tr>
                 <td class="email-masthead">
                   <a class="email-masthead_name">Singapore Pet Services</a>
                 </td>
               </tr>
               <!-- Email Body -->
               <tr>
                 <td class="email-body" width="100%">
                   <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0">
                     <!-- Body content -->
                     <tr>
                       <td class="content-cell">
                         <h1>Verify your email address</h1>
                         <p>Thanks for signing up for Singapore Pet Services We're excited to have you as an early user.</p>
                         <br/><br/>
                         <p> Please copy this code for verification by clicking  on the link below  </p>
                         <h1> ${secretToken} </h1>
                        
                         <!-- Action -->
                         <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
                           <tr>
                             <td align="center">
                               <div>
                               <p class="sub"><a href="http://singaporepetservices.com/users/verify/">Verify Email</a></p>
                              
                               </div>
                             </td>
                           </tr>
                         </table>
                         <p>Thanks,<br>Sg Pet Services</p>
                         <!-- Sub copy -->
                         <table class="body-sub">
                           <tr>
                             <td>
                               <p class="sub">If you’re having trouble clicking the button, copy and paste the URL below into your web browser.
                               </p>
                               <p class="sub"><a href="http://singaporepetservices.com/users/verify">http://singaporepetservices.com/users/verify</a></p>
                             </td>
                           </tr>
                         </table>
                       </td>
                     </tr>
                   </table>
                 </td>
               </tr>
               <tr>
                 <td>
                   <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0">
                     <tr>
                       <td class="content-cell">
                         <p class="sub center">
                           Singapore pet Services 
                           <br>
                         </p>
                       </td>
                     </tr>
                   </table>
                 </td>
               </tr>
             </table>
           </td>
         </tr>
       </table>
     </body>
     </html>`

      
   };
   smtpTransport.sendMail(mailOptions, function(err) {
     req.flash('success', 'Please verify your email');
     res.redirect("/users/verify")

  })
    
        

    },
    async getVerify(req, res, next) {
      res.render('auth/verify');
    },

    async postVerify(req, res, next) {
      try {
        const { secretToken } = req.body;
     
        const user =  await User.findOne({'local.secretToken': secretToken.trim()});
        if(!user) {
          req.flash("error", "Invalid code!");
          res.redirect("back");
          return;
        }
        user.active = true;
        user.local.secretToken = '';
        user.save();
        req.flash("success", "Email has been verified, now you may login");
        res.redirect("login");
      } catch(error) 
      {
        next(error);
      }   
    },
    async getForgot(req, res, next) {
      res.render('auth/forget');
    },
    async getReset(req, res, next) {
      let user = User.findOne({ resetPasswordToken: req.params.token,  resetPasswordExpires: { $gt: Date.now()}})
      if(!user) {
        req.flash('error', 'Password reset token is ivalid or has expired');
        return res.redirect('/forget');
      }
      res.render('auth/reset', {token: req.params.token});
    },
    postForget(req, res, next) {
      async.waterfall([
        function (done) {
          crypto.randomBytes(20, function (err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function (token, done) {
          User.findOne({
            'local.email': req.body.email
          }, function (err, user) {
            if (!user) {
              req.flash('error', 'No account with that email address exists.');
              return res.redirect('/forgot');
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            user.save(function (err) {
              done(err, token, user);
            });
          });
        },
    
        function (token, user, done) {
          var smtpTransport = nodemailer.createTransport({
            service: 'hotmail',
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            auth: {
                user: process.env.MAILGUN_USER,
                pass: process.env.MAILGUN_PW
            },
            tls: {
                ciphers:'SSLv3'
            }
        });
          var mailOptions = {
            to: user.local.email,
            from: 'administrator@singaporepetservices.com',
            subject: 'Singapore Pet services Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'https://' + req.headers.host + '/users/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            console.log('mail sent');
            req.flash('success', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
            done(err, 'done');
          });
        }
    
      ], function (err) {
        if (err) return next(err);
        res.redirect('forget');
      });
    },
    postResetToken(req, res, next) {
      async.waterfall([
        (done) => {
          User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {
              $gt: Date.now()
            }
          }, (err, user) => {
            if (!user) {
              req.flash('error', 'Passwword reset token is invalid or has expired.');
              return res.redirect('back');
            } else if (req.body.password === req.body.confirm) {
              user.local.password = user.generateHash(req.body.password);
              user.local.resetPasswordToken = undefined;
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
        function (user, done) {
          var smtpTransport = nodemailer.createTransport({
            service: 'hotmail',
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            auth: {
              user: process.env.MAILGUN_USER,
              pass: process.env.MAILGUN_PW
            },
            tls: {
              ciphers: 'SSLv3'
            }
          });
          var mailOptions = {
            to: user.local.email,
            from: 'administrator@singaporepetservices.com',
            subject: 'Password Reset Confirmation',
            text: 'You have successfully changed your password.\n\n' +
            'Thank you for using singapore pet services app\n\n'
            
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            console.log('mail sent');
            req.flash('success', 'Password has been resetted');
            res.redirect('/services')
            return done;
    
          });
        }
      ], (err) => {
        res.redirect('/services');
      });
    },
    getupdatePassword: async(req, res, next)=> {
      let user  = await User.findById(req.params.id)
      res.render('users/updatePassword', { user} )
    },
    updatePassword: (req, res) => {
      User.findById(req.user._id, (err, user) => {
        if (err) {
          return next(err);
        }
        if (user.validPassword(req.body.currentPassword)) {
          if (req.body.password === req.body.confirm) {
              user.local.password = user.generateHash(req.body.password);
              user.save((err) => {
                req.logIn(user, (err) => {
                  req.flash('success', 'Password updated successfully!');
                  res.redirect(`profiler/${req.user.id}`);
                });
              });
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        } else {
            req.flash("error", "Incorrect password.");
            return res.redirect('back');
        }
      })
    },
    async getUserProfilepublic(req, res, next) {
      let user = await User.findById(req.params.id).populate('followers',).exec();
  
      let services = await Services.find().where('author.id').equals(user._id)
      let reviews = await Reviews.find().where('author.id').equals(user._id)    
      res.render('users/profile', { services, reviews, user })
    
    },
    async getLogin(req, res, next) {
      res.render("auth/login");
    },
    async postLogin(req, res, next) {
      passport.authenticate('local-login', {
        successRedirect: '/services',
        failureRedirect: '/users/login',
        successFlash: "Welcome back",
        failureFlash: true
      })(req, res)
    },
    async getLogout(req, res, next) {
      req.logout();
      req.flash("success", "You have successfully logged out");
      res.redirect("/");

    }, 
    async getProfile(req, res, next) {
      var perPage = 4;
      var pageQuery = parseInt(req.query.page);
      var pageNumber = pageQuery ? pageQuery : 1;
      
      let user = await User.findById(req.params.id).populate('reviews').exec()
      let service = await Services.find().where('author.id').equals(user._id, '-password').skip((perPage * pageNumber) - perPage).limit(perPage).exec()
      let count = await Services.count().where('author.id').equals(user._id, '-password')
      res.render("users/profiler",  {user, service, current: pageNumber,
        pages: Math.ceil(count / perPage)}); 
    },
    async getProfileEdit(req, res, next) {
      let user = await User.findById(req.params.id);
      let service = await Services.find().where('author.id').equals(user._id).exec();
      
      res.render("users/edit", {user, service})
    },
    async editProfile(req, res, next) {
      let user = await User.findByIdAndUpdate(req.params.id, req.body);
      // check if there was a file uploaded
      if(req.file) {
          // delete existing image using it's public_id
          await cloudinary.v2.uploader.destroy(user.local.images.public_id);  
          // upoad new image and store image url and public_id in user object
          let result =  await cloudinary.v2.uploader.upload(req.file.path);
          user.local.images.public_id = result.public_id;
          user.local.images.url = result.secure_url;
          // save/update user in database
          user.save();
      }
      res.redirect(`/users/profiler/${user.id}`)
    },
    getFbAuth: (req,res,next) => {
      passport.authenticate('facebook',
        { callbackURL:`https://singaporepetservices.com/users/auth/facebook/callback/${req.params.action}`,
          scope: 'email'
        }
      )(req, res, next);
    },
    getFbAuthCb: passport.authenticate('facebook', {
      callbackURL: 'https://singaporepetservices.com/users/auth/facebook/callback/login',
      successRedirect: '/services',
      failureRedirect: '/users/login',
      successFlash: 'Welcome back!',
      failureFlash: 'Facebook login failed!'
    }),
}