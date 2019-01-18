const express = require('express');
const router = express.Router({mergeParams: true});
const multer = require('multer');
const { cloudinary, storage} = require('../cloudinary');
const upload = multer({storage});
const { errorHandler, isServiceAuthor, isLoggedIn } = require("../middleware/error");
const { getServices, newServices, createServices,  servicesEdit, servicesInfo, serviceUpdate, serviceDestroy } = require("../controllers/services")


//Show all services
router.get("/", errorHandler(getServices));

//New Services
router.get('/new', isLoggedIn, errorHandler(newServices));
 
router.post('/', isLoggedIn, upload.array('images', 10), errorHandler(createServices));

router.get('/:id', errorHandler(servicesInfo));

//Edit route
router.get('/:id/edit', isServiceAuthor, errorHandler(servicesEdit));


router.put("/:id", isServiceAuthor, upload.array('images', 10), errorHandler(serviceUpdate))

router.delete("/:id", isServiceAuthor, errorHandler(serviceDestroy));

module.exports = router;