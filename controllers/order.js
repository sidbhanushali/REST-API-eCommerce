//destructure from module.exports object in /models/order
const { Order, ProductCart } = require("../models/order");

//param /:orderId controller
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
  //order has veriety of products 
  //first arguement is which field you want to populate from
  //next arg is the info needed from products field related in model and products model refers to the product model
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "NO order found in DB"
        });
      }
      //create order object in the req and populate w/order 4 front end
      req.order = order;
      next();
    //end find by ID
    });
  //end exports   
};


exports.createOrder = (req, res) => {
//order.user property being populated by /:userId param
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    //if error in order
    if (err) {
      return res.status(400).json({
        error: "Failed to save your order in DB"
      });
    }
    //order save success
    res.json(order);
  });
//end exports
};

exports.getAllOrders = (req, res) => {
  //find all orders
  Order.find({})
    //get id and name from user model
    .populate("user", "_id name")
    .exec((err, orders) => {
      //if err 
      if (err) {
        return res.status(400).json({
          error: "No orders found in DB"
        });
      }
      //send orders to front end 
      res.json(orders);
      //end .find chain
    });
//end exports
};

exports.getOrderStatus = (req, res) => {
//get status enums from order schema
  res.json(Order.schema.path("status").enumValues);
};

//updating status enums in the order model
exports.updateStatus = (req, res) => {
  //update without returning
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Cannot update order status"
        });
      }
      res.json(order);
    }
  );
};


