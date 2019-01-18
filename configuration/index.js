module.exports = {
 facebookAuth : {
    clientID      : process.env.FB_APP_ID, // your App ID
    clientSecret  : process.env.FB_APP_SECRET, // your App Secret
    callbackURL: "https://localhost:3000/users/auth/facebook/callback",
    profileFields: ['id', 'first_name', 'last_name', 'picture.type(large)', 'email'],
    enableProof: true
  }
};
