const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('../models/user');
const config = require('../configuration');


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

passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('profile', profile);
      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);
      
      const existingUser = await User.findOne({ "facebook.id": profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
  
      const newUser = new User({
        method: 'facebook',
        facebook: {
          id: profile.id,
          email: profile.emails[0].value
        }
      });
  
      await newUser.save();
      done(null, newUser);
    } catch(error) {
      done(error, false, error.message);
    }
  }));