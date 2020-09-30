const express = require('express');
const router = express.Router(); 
//import product controllers
const {
   getProductById,
   createProduct,
   getProduct,
   photo,
   deleteProduct, 
   updateProduct, 
   getAllProducts,
   getAllUniqueCategories
}
   = require('../controllers/product')

//import Auth controllers 
const {isSignedIn, isAuthenticated, isAdmin} = require('../controllers/auth')
//import user controllers (id param)
const {getUserById} = require('../controllers/user')


//params
router.param("productId", getProductById);
router.param("userId", getUserById);


//routes

//get a product 
router.get("/product/:productId", getProduct);
 //route to load picture seprately -- MW controller
 router.get("/product/photo/:productId", photo);


//product listing route -- get all products w/ limit query
router.get("/products", getAllProducts);
//product listing route --  get all unique category
router.get("/products/categories", getAllUniqueCategories)



//create product -- ADMIN ROUTE
router.post("/product/create/:userId",
isSignedIn, isAuthenticated,isAdmin,createProduct);

//update product  route -- ADMIN ROUTE
router.put("/product/:productId/:userId",
isSignedIn, isAdmin, isAuthenticated, updateProduct);


//delete product route -- ADMIN ROUTE
router.delete("/product/:productId/:userId",
 isSignedIn, isAdmin, isAuthenticated, deleteProduct);




module.exports = router;