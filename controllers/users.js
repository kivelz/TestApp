const User = require('../models/user');
const Services = require('../models/services')
const passport = require('passport');
const randomstring =require('randomstring');
const mailer = require('../misc/mailer');


module.exports = {
    
  getTerms: async(req, res, next)=> {
    res.render('terms');
  },
    getRegister: async(req, res, next)=> {
        res.render('auth/register');
    },
    userRegister: async(req, res, next) => {
      const secretToken = randomstring.generate();
  
      const { firstName, username, lastName, avatar, password, confirmatioPassword, email, confirmEmail, gender} = req.value.body

      const foundUser = await User.findOne({ "local.email": email });
      if (foundUser) { 
        req.flash('error', "Email already existed");
        res.redirect('back')
        return;
      }
  
      const newUser = new User({
        
        method: 'local',
        local: {
        email,
        confirmEmail,
        password,
        confirmatioPassword,
        firstName,
        lastName,
        avatar, 
        username, 
        secretToken, 
        gender
        }
       
      });
      newUser.local.password = newUser.generateHash(password);

      delete req.value.confirmEmail; 
      delete req.value.confirmationPassword;
     
     
      if(req.body.adminCode === process.env.adminCode) {
       newUser.isAdmin = true;
     }
      await newUser.save();
      console.log('newUser', newUser)
      const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
            font-size: 16px;
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
                    <a class="email-masthead_name">Canvas</a>
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
                          <p>Thanks for signing up for Canvas! We're excited to have you as an early user.</p>
                          <br/><br/>
                          <p> Please copy this code for verification by clicking  on the Verify Email Button  </p>
                          <p>${secretToken}<p> 
                          <!-- Action -->
                          <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center">
                                <div>
                                  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{action_url}}" style="height:45px;v-text-anchor:middle;width:200px;" arcsize="7%" stroke="f" fill="t">
                                  <v:fill type="tile" color="#414EF9" />
                                  <w:anchorlock/>
                                  <center style="color:#ffffff;font-family:sans-serif;font-size:15px; text-decoration:none;">Verify Email</center>
                                </v:roundrect><![endif]-->
                                  <a href="http://${req.headers.host}/users/verify/" class="button button-blue" style="color: #fff">Verify Email</a>
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
                                <p class="sub"><a href="http://${req.headers.host}/users/verify">http://${req.headers.host}/users/verify</a></p>
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
                            Canvas Labs, Inc.
                            <br>325 9th St, San Francisco, CA 94103
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
      </html>`;

     await mailer.sendMail('admin@sgpetservices.com', email, 'Please verify your email', html);
      req.flash("success", "Please check your email!");
      res.redirect("verify")

        
      res.redirect("/services")
    },
    async getVerify(req, res, next) {
      res.render('auth/verify');
    },

    async postVerify(req, res, next) {
      try {
        const user =  await User.findOne(req.params.secretToken);
        console.log(user)
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
    async facebookOAuth(req, res, next) {
      // Generate token
  
    },
    async getForgot(req, res, next) {
      res.render('auth/forget');
    },
    async getReset(req, res, next) {
      let user = User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}})
      if(!user) {
        req.flash('error', 'Password reset token is ivalid or has expired');
        return res.redirect('/forget');
      }
      res.render('auth/reset', {token: req.params.token});
    },

    async getUserProfilepublic(req, res, next) {
      let user = await User.findById(req.params.id);
      
      let services = await Services.find().where('author.id').equals(user._id).populate('reviews').exec();       
      res.render('users/profile', { services, user })
    
    },
    async getLogin(req, res, next) {
      res.render("auth/login");
    },
    async postLogin(req, res, next) {
      passport.authenticate('local-login', {
        successRedirect: '/services',
        failureRedirect: '/users/login',
        successFlash: "welcome back",
        failureFlash: true
      })(req, res)
    },
    async getLogout(req, res, next) {
      req.logout();
      req.flash("success", "You have successfully logged out");
      res.redirect("/");

    }, 
    async getProfile(req, res, next) {
      let user = await User.findById(req.params.id);
      let service = await Services.find().where('author.id').equals(user._id).populate('reviews').exec();  
      res.render("users/profiler",  {user, service}); 
    },
    async getProfileEdit(req, res, next) {
      let user = await User.findById(req.params.id);
      let service = await Services.find().where('author.id').equals(user._id).exec();
      res.render("users/edit", {user, service})
    },
    async editProfile(req, res, next) {
   let user =  await User.findByIdAndUpdate(req.params.id, req.body.user);
      res.redirect(`/users/profiler/${user.id}`)
    }
}