const userModel = require('../models/User')
const orderModel = require('../models/order')



//router.param controller MW-method populates req.profile on any route with userID
exports.getUserById = (req, res, next, id) => {
    //middleware method 
    userModel.findById(id).exec((err, user)=>{
        //if no user-->(need to pass if err OR no user)
        if(err || !user){
            res.status(400).json({error:'User not found'})
        }   
        //if user found..store it in our req.profile obj
        req.profile = user; 
        next()
    })
//end exports v
}


//reuturns the profile object inside the req populated by the router.param
exports.getUser = (req, res) => {
//hide salt and encry_password values in req.profile
req.profile.salt = undefined; 
req.profile.encry_password = undefined; 


return res.json(req.profile)
}

exports.updateUser = (req, res) => {
    userModel.findByIdAndUpdate(
        {_id: req.profile._id},  //find user
        {$set: req.body},  //what to update (user's req from front end)
        {new: true, useFindAndModify: false}, 
        (err, user)=>{
            //if err or no user
            if(err||!user){
                return res.status(400).json({err: 'Could not update User'})
                }
        //if user found, return the user info to the front end (hide salt and password)
        user.salt = undefined; 
        user.encry_password = undefined; 
        res.json(user)
            
        }
    )
 }

 exports.userPurchaseList = (req, res)=>{

    orderModel.find({user: req.profile._id})
      //reference the user collection and the desired fields
        .populate("user", "_id name") 
        .exec((err, order)=>{
            //if err or no order 
          if(err || !order){
              res.status(400).json({
                  error: "No Orders found for this user"})
             }
          // if there is an order return the order
          res.json()
        })

 }

//MW that populates the purchase property (type arr) in the user model 
exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  //reciving order info from front end and looping through it
  req.body.order.products.forEach(product => {
    //create object foreach product and push to local purchases array
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id
    });
  });

  //store in in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    //update usersModel purchases array with local purchases array 
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list"
        });
      }
      next();
    }
  );
};

