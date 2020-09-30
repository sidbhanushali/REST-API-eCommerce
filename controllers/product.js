const fs = require('fs')
const productModel = require('../models/product')
const formidable = require("formidable")
const _loadsh = require("lodash");
const { sortBy } = require('lodash');


//router.param MW controller for populating req.product
exports.getProductById = (req, res, next, id) => {
    //find by id and exec
    productModel.findById(id)
        //relate by category only
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found"
        });
      }
      //if found populate req.product w fetched info
      req.product = product;
      next();
    });
};

//create product --> admin controller
exports.createProduct = (req, res) => {
    //create formidable form data instance
let form = new formidable.IncomingForm();
  //formidable-keep the file extentions 
form.keepExtensions = true;
  //formidable method
form.parse(req, (err, fields, file) => {
  //handle err param
  if (err) {
    return res.status(400).json({
      error: "problem with image"
    });
  }
   //destructure the field param from form.parse
  const { name, description, price, category, stock } = fields;

// field validation thru formidable (if no fields then send err)
  if (!name || !description || !price || !category || !stock) {
    return res.status(400).json({
      error: "Please include all fields"
    });
  }
 //pass the parsed field data into the product model
  let product = new productModel(fields);

  //handle file param check if photo
  if (file.photo) {
        //Only 3 MB photo file 
       if (file.photo.size > 4000000) {
      return res.status(400).json({
        error: "File size too big!"
      });
    }
     //put img data into productModel.photo for db
    product.photo.data = fs.readFileSync(file.photo.path);
  //include content type for DB 
    product.photo.contentType = file.photo.type;
  }
  // console.log(product);

  //save parsed productmodel to the DB
  product.save((err, product) => {
    if (err) {
      res.status(400).json({
        error: "Saving tshirt in DB failed"
      });
      // console.error(err);
    }
     //if saved send json product
    res.json(product);

    //end product.save
   });
  //end formidable form.parse()
});
//end exports
};

//get a product info
exports.getProduct = (req, res) => {
  //dont send raw binary photo data to user
  req.product.photo = undefined;
  return res.json(req.product);

}

//MW parses the photo so the rest of the product can load 
exports.photo = (req, res, next) => {
  if(req.product.photo.data){
    //sets response headers -->req.product.photo.contentType set in schema
    res.set("Conent-Type", req.product.photo.contentType)
    return res.send(req.product.photo.data)
    
  }
  next();
}


//MW controller --> existing product from req.product, parses thru formidable, and saves to db
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  //formidable-keep the file extentions 
form.keepExtensions = true;
  //formidable method
form.parse(req, (err, fields, file) => {
  //handle err param
  if (err) {
    return res.status(400).json({
      error: "problem with image"
    });
  }
   
//no vaildation from formidable bc not all fields are updated
 //req.product from productId params controller
let product = req.product
//takes existing values in object
//update product object with fields (from formidable)
product = _loadsh.extend(product, fields)

  //handle file param check if photo
  if (file.photo) {
        //Only 3 MB photo file 
       if (file.photo.size > 4000000) {
      return res.status(400).json({
        error: "File size too big!"
      });
    }
     //put img data into productModel.photo for db
    product.photo.data = fs.readFileSync(file.photo.path);
  //include content type for DB 
    product.photo.contentType = file.photo.type;
  }
  // console.log(product);

    //save the updaetd product 
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Could not update product!"
        });
        // console.error(err);
      }
      //if saved send json product
      res.json(product);

      //end product.save
    });
  //end formidable form.parse()
  });
//end exports 
}

//delete a proudct --> admin controller
exports.deleteProduct = (req, res) => {
  //req.product coming from /:productId param
let product = req.product
//product is coming from a mongoose object
product.remove((err, deletedProduct)=>{
  //if delete failed
      if(err){
        return res.status(400).json({
          error: "Could not delete product",  
        })
      }
      //otherwhys delete sucess 
      res.json({
        msg: "product deleted successfully "
      })
    //end .remove() method
   })
//end exports
}

// product listing query -- list products
exports.getAllProducts = async (req, res) => {
  //front end query with property of limit (convert form string)
  let limit = req.query.limit ? parseInt(req.query.limit) : 8
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

      productModel.find()
      //dont include the photo
      .select("-photo")
      //populate by category
      .populate("category")
      //sort by req.Query, (ascending order)
      .sort([[sortBy, "asc"]])
      //set limit of products pulled from user
      .limit(limit)
      .exec((err, products)=>{
        //if err
        if(err){
          return res.status(400).json({
            error: "No Products found"
          });
        } 
    // return products to frontend
    res.json(products)
     //end .find chain 
    })
    
//end export
}


//update stock&Sold on purchase -- mw Model.bulkwrite
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map(prod => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        //prod.count coming from front end quantity
        update: { $inc: { stock: -prod.count, sold: +prod.count } }
      }
    };
    //end products.map
  });
//Middleware
  productModel.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed"
      });
    }

    next();
//end bulkWrite
  });
  //end exports
};


//get all unique categories middleware
exports.getAllUniqueCategories = (req, res) => {

  productModel.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No category found"
      });
    }
    res.json(category);
  });
//end exports
}