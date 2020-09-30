const mongoose = require("mongoose");
//need to use object ID from mongoose.schema to relate the two collections
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2001
    },

    price: {
      type: Number,
      required: true,
      maxlength: 10,
      trim: true
    },

    //refers to categories in the product schema by ID
    category: {
      type: ObjectId,
      ref: "Category",
      required: true
    },

    stock: {
      type: Number
    },

    sold: {
      type: Number,
      default: 0
    },

    photo: {
      data: Buffer,
      contentType: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);