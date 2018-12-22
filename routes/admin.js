const middleware= require('../middleware');
const express = require('express');
const router = express.Router();
const Users = require("../models/user");
const {errorHandler, isAdmin} = require('../middleware/error')
const {getUsers, removeUsers} = require('../controllers/admin');

router.get("/admin", isAdmin, errorHandler(getUsers))        
      
router.delete("/admin/:id", isAdmin, errorHandler(removeUsers))
 
module.exports = router;