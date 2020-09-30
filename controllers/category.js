
const categoryModel = require('../models/category')



// category param controller (populates the req.category)
exports.getCategoryById = (req, res, next, id) => {

    categoryModel.findById(id).exec((err, category)=>{
        //if err or no category
        if(err||!category){
           return res.status(400).json({
               error: 'Could not find category'
            })
        }
        //if there was a category found
        req.category = category;
        next();
    });
//end export
}


//controller for /category/create/:userId (admin route)
exports.createCategory = (req, res) => {
    //create new categoryModel from admin info and persist to DB
    const category = new categoryModel(req.body)
    category.save((err, category)=>{
         //if err or no category
         if(err||!category){
            return res.status(400).json({
                error: 'Could not save category.'
             })
         }
         //if category creation success
        res.json({ category: category})
    })

}

//returns res.category
exports.getCategory = (req, res) => {
    return res.json(req.category);
}


exports.getAllCategories = (req, res) => {
    categoryModel.find({}).exec((err, categories)=>{
        //if err or no categories
        if(err || !categories ){
           return res.status(400).json({
                error: "No categories found!"
            })
        }
        // if all categories found return it to front end
        res.json(categories)
    })
}


//update category put req controller (admin route)
exports.updateCategory = (req, res) =>{
    //req.category is made possible by categoryId param middleware
    const category = req.category; 
    //populate the category from the front end req
    category.name = req.body.name
//now save for PUT - thats all thats required in the model
    category.save((err, updatedCateory)=>{
        if(err || !updatedCateory ){
           return res.status(400).json({
                error: "Could Not Update Category"
            })
        }
        // if success return new fields to admin
        res.json(updatedCateory)
    })
   //end exports 
}


exports.removeCategory = (req, res) => {
//req.category is made possible by categoryId PMW
    const category= req.category

    category.remove((err, category)=>{
        //if err or no category found 
        if(err||!category){
           return res.status(400).json({error: "Failed to delete category"})
        }
        //if it was deleted show admin
        res.json({msg: `${category} category was deleted`})
    })
 //end exports
}