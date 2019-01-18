const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const Service = require('../models/services')
const Review = require('../models/review')

// Create a schema
const userSchema = new Schema({

  local: {
    email: {
      type: String,
      lowercase: true,
      unique: true,
    },
    password: { 
      type: String,
      require: true
    },
    gender: String,
    secretToken: String,
    images:  {url: String, public_id: String},
    firstName: String,
    info: String,
    lastName: String,
    username: {
      type: String,
      unique: true,
      index: true,
    }
  },
  facebook : {
    id: String,
    token: String,
    email: String,
    name: String,
    avatar: String,
},
notifications: [
  {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Notification'
  }
],

followers: [
  { 
    type: mongoose.Schema.ObjectId, ref: 'User' 
  }
],
following: [
  { type: mongoose.Schema.ObjectId, ref: 'User' 
}
],



isAdmin: {type: Boolean, default: false},
resetPasswordToken: String,
resetPasswordExpires: Date,
active: {type: Boolean, default: false},
reviews: [
  {   type: Schema.Types.ObjectId,
      ref: "Review"
  }
],

});


userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// pre-hook middleware to delete all user's posts and comments from db when user is deleted
userSchema.pre('remove', async function(next) {
try {
    await Service.remove({ 'author': { '_id': this._id } });
    await Review.remove({ 'author': { '_id': this._id } });
  
    next();
} catch (err) {
    // does this work?
    next(err);
}
});


module.exports = mongoose.model('User', userSchema);