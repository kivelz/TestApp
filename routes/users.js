const express = require('express');
const router = express.Router({mergeParams: true});
const {
  errorHandler,
  isUser,
  isAuthenticated,
  isLoggedIn
} = require('../middleware/error');
const {validateBody,schemas} = require('../helpers/routehelpers');
const User = require('../models/user')
const Notification = require('../models/notifications')

const {
  getLogin,
  postLogin,
  getLogout,
  getRegister,
  userRegister,
  getUserProfilepublic,
  getProfile,
  getProfileEdit,
  editProfile,
  getVerify,
  postVerify,
  resetPassword,
  getForgot,
  getReset,
  getTerms,
  getRegisterAdmin,
  getFbAuth,
  getFbAuthCb,
  postForget, 
  postResetToken,
  getupdatePassword,
  updatePassword
} = require("../controllers/users");

const multer = require('multer');
const upload = multer({'dest': 'uploads/'});
const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dlreimtak', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});



//register page
router.get('/register', errorHandler(getRegister));

router.post('/register',  upload.single('images'), validateBody(schemas.authSchema), errorHandler(userRegister));

router.get('/register/admin', errorHandler(getRegisterAdmin))


router.get('/login', isAuthenticated, errorHandler(getLogin));

router.get('/forget', errorHandler(getForgot));

router.post('/forget', errorHandler(postForget))
 

router.get('/reset/:token', errorHandler(getReset));


router.post('/reset/:token', errorHandler(postResetToken))
 
router.post('/reset', errorHandler(resetPassword));

router.get('/profiler/updatePassword/:id' , errorHandler(getupdatePassword))

router.put('/users', errorHandler(updatePassword))

router.get('/register/terms', errorHandler(getTerms));

router.post('/login', errorHandler(postLogin));

router.get('/verify', errorHandler(getVerify));

router.post('/verify', errorHandler(postVerify));

router.get('/logout', errorHandler(getLogout));

router.get('/profile/:id', errorHandler(getUserProfilepublic))

router.get('/profiler/:id', isUser, errorHandler(getProfile));

router.get('/profiler/:id/edit', isUser, errorHandler(getProfileEdit));

router.put('/profiler/:id', isUser, upload.single('images'), errorHandler(editProfile));

router.get('/auth/facebook/:action', getFbAuth);

router.get('/auth/facebook/callback/login', isAuthenticated, getFbAuthCb);


router.get('/follow/:id', isLoggedIn, async function(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash("error", "User does not exist");
      res.redirect('back')
      return res.status(404).json({ error: 'User does not exist' });
      
    }

    if (user.followers.indexOf(req.user.id) !== -1) {
      req.flash("error",`You're already following ${user.local.username || user.facebook.name}`);
      return res.redirect('back');
    }

  
    user.followers.addToSet(req.user._id);
    await user.save();

    const users = await User.findById(req.user.id);
    users.following.addToSet(req.user.id);
    await users.save();
    req.flash("success", `You're following ${user.local.username || user.facebook.name}`)
    return res.redirect('back')
  } catch (err) {
    return next(err);
  }

});

router.delete('/follow/:id', isLoggedIn, async function(req, res, next) {
  try {

    const user = await User.findById(req.params.id);

      if (!user) {
        req.flash("error", "User not found")
        return res.redirect("back")
      }

      const following = user.followers.indexOf(req.user.id);
      if (following === -1) {
        req.flash("error", `You're not following ${user.username || user.facebook.name}`)
        return res.redirect("back")
      }

      user.followers.splice(following, 1);
      await user.save();

      const userLogged = await User.findById(req.user.id);

      const positionUnfollow = userLogged.following.indexOf(user.id);
      userLogged.following.splice(positionUnfollow, 1);

      await userLogged.save();
      req.flash('success', `You have sucessfully unfollowed ${user.local.username || user.facebook.name}`)
      return res.redirect("back");
    } catch (err) {
      return next(err);
  }
});
router.get('/notifications', isLoggedIn, async function(req, res) {
  try {
    let user = await User.findById(req.user._id).populate({
      path: 'notifications',
      options: { sort: { "_id": -1 } }
    }).exec();
    let allNotifications = user.notifications;
    res.render('notifications/index', { allNotifications });
  } catch(err) {
    req.flash('error', err.message);
    res.redirect('back');
  }
});

// handle notification
router.get('/notifications/:id', isLoggedIn, async function(req, res) {
  try {
    let notification = await Notification.findById(req.params.id);
    notification.isRead = true;
    notification.save();
    res.redirect(`/services/${notification.servicesId}`);
  } catch(err) {
    req.flash('error', err.message);
    res.redirect('back');
  }
});

module.exports = router;