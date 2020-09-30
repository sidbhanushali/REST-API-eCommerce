const express = require('express');
const router = express.Router()
//import user controllers
const {getUserById, getUser, updateUser, userPurchaseList} = require('../controllers/user')
//import auth controllers
const {isSignedIn, isAuthenticated, isAdmin} = require('../controllers/auth')
const userModel = require('../models/User')


//top level route is /api

//anytime we use :userId in any of our routes this populates the req.profile object
router.param("userId", getUserById)


//returns the users req.profie
router.get('/user/:userId',
 isSignedIn, isAuthenticated, getUser)

//edit user profile
router.put('/user/:userId',
 isSignedIn, isAuthenticated, updateUser)

//get users purchases 
router.get('/user/orders/:userId',
 isSignedIn, isAuthenticated, userPurchaseList)



module.exports = router;