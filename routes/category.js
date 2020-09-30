const express = require('express')
const router = express.Router()
//auth controllers 
const {isSignedIn, isAdmin, isAuthenticated} = require('../controllers/auth')

//user controllers
const {getUserById} = require('../controllers/user')

// category controllers
const {getCategoryById, createCategory, getCategory, getAllCategories, updateCategory, removeCategory} = require('../controllers/category')

//router.params
router.param("userId", getUserById)
router.param("categoryId", getCategoryById)


//CRUD routes 
//get a category
router.get('/category/:categoryId', getCategory)
//get all categories
router.get('/categories', getAllCategories)


//Create categories ROUTE -->  ADMINS ONLY!
router.post("/category/create/:userId",
isSignedIn, isAuthenticated,isAdmin,createCategory);



//update category route ADMIN
router.put("/category/:categoryId/:userId",
 isSignedIn, isAuthenticated, isAdmin, updateCategory) 



//delete category route ADMIN 
router.delete("/category/:categoryId/:userId",
 isSignedIn, isAuthenticated, isAdmin, removeCategory)



module.exports = router
