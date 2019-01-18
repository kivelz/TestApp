const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../configuration');
var FacebookStrategy = require('passport-facebook').Strategy;


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
      done(err, user);
    });
  });



passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    
}, async (req, email, password, done) => {
  try {
      // 1) Check if the email already exists
      const user = await User.findOne({ 'local.email': email });
      if (!user) {
          return done(null, false, { message: "Email doesn't exist" });
      }

      // 2) Check if the password is correct

      if (!user || !user.validPassword(password))
              return done(null, false, req.flash('error', 'Incorrect username or password.')); //

      if(!user.active) {
        return done(null, false, { message: "Please Verify your email first" });
      }

      
      return done(null, user);
  } catch(error) {
      return done(error, false), req.flash('error', 'You are already Logged in');
  }
}));


  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  var fbStrategy = config.facebookAuth;
  fbStrategy.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  passport.use(new FacebookStrategy(fbStrategy,

  function(req, token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

      // check if the user is already logged in
      if (!req.user) {

          User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
              if (err)
                return done(err);
              if (user) {
                  // if there is a user id already but no token (user was linked at one point and then removed)
                  if (!user.facebook.token) {
                    user.facebook.token = token;
                    user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    user.facebook.email = (profile.emails[0].value || '').toLowerCase();
                    user.facebook.avatar = profile.photos[0].value;
                    
                    user.save(function(err) {
                      if (err)
                        return done(err);
                      return done(null, user), req.flash("You are now registed and logged In");
                    });
                  }
                  return done(null, user); // user found, return that user
              } else {
                  // if there is no user, create them
                  var newUser            = new User();

                  newUser.facebook.id    = profile.id;
                  newUser.facebook.token = token;
                  newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                  newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
                  newUser.facebook.avatar = profile.photos[0].value;   
                  newUser.save(function(err) {
                    if (err)
                      return done(err);
                    return done(null, newUser), req.flash("You are now registed and logged In");
                  });
              }
          });

      } 
    });

  }));

