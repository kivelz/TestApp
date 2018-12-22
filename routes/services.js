const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({'dest': 'uploads/'});
const { errorHandler, isServiceAuthor, isLoggedIn } = require("../middleware/error");
const { getServices, newServices, createServices,  servicesEdit, servicesInfo, serviceUpdate, serviceDestroy } = require("../controllers/services")


const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dlreimtak', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


//Show all services
router.get("/", errorHandler(getServices));


//New Services
router.get('/new', isLoggedIn, errorHandler(newServices));
 
router.post('/', isLoggedIn, upload.array('images', 4), errorHandler(createServices));

router.get('/:id', errorHandler(servicesInfo));

//Edit route
router.get('/:id/edit', isServiceAuthor, errorHandler(servicesEdit));


router.put("/:id", isServiceAuthor, upload.array('images', 4), errorHandler(serviceUpdate))

router.delete("/:id", errorHandler(serviceDestroy));

module.exports = router;