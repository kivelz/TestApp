const express = require("express");
const router  = express.Router({mergeParams: true});
const { reviewCreate, reviewUpdate, reviewDestroy } = require('../controllers/reviews');
const { errorHandler, isReviewAuthor, isLoggedIn } = require('../middleware/error');



//new comment(redundant to be deleted)
router.post('/', isLoggedIn, errorHandler(reviewCreate));

router.put('/:review_id', isReviewAuthor, errorHandler(reviewUpdate));

router.delete('/:review_id', isReviewAuthor, errorHandler(reviewDestroy));



module.exports = router;