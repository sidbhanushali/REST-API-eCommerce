
const UserModel = require("../models/User")
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

require('dotenv').config()



//signup controller
exports.signup = (req, res) => {
    //(express validator binds the validationResult with the req)
    const errors =validationResult(req)

    if (!errors.isEmpty()){
        return res.status(400).json({
            //express-vaildtor - validationResult object populated from .check()  validator 
            error: errors.array()[0].msg,
            problem: errors.array()[0].param
            
        })
    }

        //req.body is coming from bodyParser midware
    const User = new UserModel(req.body)
    User.save((err, user)=>{
        //if not saved then error
            if(err){
                return res.status(400).json({err: "400 couldnt save collection to Database"})
            }
            //if saved then json response 
            res.json({
                attempt: "success! New User added to Database",
                name: user.name,
                lastname: user.lastname,
                email: user.email, 
                id: user._id
            })

  })
}


//signin controller
exports.signin = (req, res) => {
    //check if all the required info is being passed through(email&password from req.body)
    const errors = validationResult(req);
    const { email, password } = req.body;
  
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg
      });
    }
  //check if the email even exists in our DB findone
    UserModel.findOne({email}, (err, user) => {
        //check if res response if err or no user
      if (err || !user) {
        return res.status(400).json({
          error: "That email does not exsist in our database"
        });
      }
      //check if password matches the emails password we have in our db --> if PW doesnt match : 
      if (!user.autheticate(password)) {
          return res.status(401).json({
            error: "Your Email and password do not match"
          });
        }
      //sign in the user (create token and put it in cookie)
      //create token
      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      //put token in cookie logout to clearcookies
      res.cookie("token", token, { expire: new Date() + 9999 });
      //send response to front end
      const { _id, name, email, role } = user;
      return res.json({ token, user: { _id, name, email, role } });
    });
    //end exports
  };


//signout controller
exports.signout = (req, res) => {
  //clear the cookie to signout the user
  //method coming from cookieParser
  res.clearCookie("token")
   res.json({ message: "User signout successful" })
}


//protect routes methods
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  //cookieParser allows us to set userProperties in browser
  //auth property contains ID 
  userProperty: "auth"
  //next() not needed because prebuilt functions like this already has it:)
})


//custom middlewares
exports.isAuthenticated = (req, res, next) => {
//req.profile set from the front end & req.auth is being set in isSignedIn
let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if(!checker) {
    res.status(403).json({error: 'FORBIDDEN, YOU DONT HAVE PERMISSION! '})
  }
  next();
}




exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Access forbidden! You need to be an Admin to do this!"
    });
  }
  next();
};