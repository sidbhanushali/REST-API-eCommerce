const express = require('express');
const router = express.Router(); 

//order conctrollers 
const {
     getOrderById,
     createOrder,
     getAllOrders,
     updateStatus,
     getOrderStatus} 
    = require("../controllers/order")

//product conctrollers 
const {updateStock} = require("../controllers/product")

//import Auth controllers 
const {isSignedIn, isAuthenticated, isAdmin} = require('../controllers/auth')
//import user controllers (id param, pushOrdersToList)
const {getUserById, pushOrderInPurchaseList} = require('../controllers/user');
const { update } = require('../models/User');

//params routes
router.param("userId", getUserById)
router.param("orderId", getOrderById)



//create order route
router.post("/order/create/:userId", 
isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder)


//get all orders for user
router.get("/orders/all/:userId", 
isSignedIn, isAuthenticated, isAdmin, getAllOrders )


//get status of orders
router.get("/order/status/:userId",
 isSignedIn, isAuthenticated, isAdmin, getOrderStatus)
//update status of orders -- ADMINS ONLY
router.put("/order/:orderId/status:userId",
 isSignedIn, isAuthenticated, isAdmin, updateStatus)


module.exports = router;