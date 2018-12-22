const express = require('express');
const router = express.Router();
const User =require("../models/user")
const { errorHandler, isReviewAuthor } = require('../middleware/error');
const {getUserss, landingPage} = require('../controllers/index')



router.get('/', errorHandler(landingPage));

module.exports = router;