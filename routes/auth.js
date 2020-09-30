const express = require('express');
const router = express.Router()
const {check} = require('express-validator')
//require controllers
const {signout, signup, signin, isSignedIn} = require('../controllers/auth')


//top level localhost:1111/api/.../

//express validator as second param --> check("field_name").whatToCheck({ properties }) --> still works this way
router.post(
            "/signup",
            [ check("name", "Try another name, at least 1 letter").isLength({ min: 1}),
              check("email", "email is required!").isEmail(),
              check("password", "password should be at least 3 char").isLength({ min: 1 })
            ],
            signup)

 router.post(
              "/signin",
              [ check("email", "Email required, Please enter a valid email.").isEmail(),
                check("password", "password should be at least 1 character").isLength({min: 1})
                ], 
              signin
          )


    
 router.get("/signout", signout)



 router.get('/testroute', isSignedIn, (req,res)=>{
   res.send('hey buddy this is a protected route ok')
 })


          module.exports = router;



