const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const Service = require('../models/services')
const Review = require('../models/review')

// Create a schema
const userSchema = new Schema({
  isAdmin: {type: Boolean, default: false},
  active: {type: Boolean, default: false},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true,
      unique: true,
    },
    password: { 
      type: String
    },
    gender: String,
    active: {type: Boolean},
    secretToken: String,
    avatar: String,
    avatarId: String,
    firstName: String,
    info: String,
    lastName: String,
    username: String,
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    avatar: {
      type: String
    }
  }
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
    // DOES THIS NEED TO BE:
    // await Campground.remove({ 'author.id': this._id });
    // await Comment.remove({ 'author.id': this._id });
    // ???????
    next();
} catch (err) {
    // does this work?
    next(err);
}
});
module.exports = mongoose.model('User', userSchema);