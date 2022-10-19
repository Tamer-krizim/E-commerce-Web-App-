const mongoose = require("mongoose");

// create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Required"],
      unique: [true, "Category must be unique"],
      minlenght: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      loercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
// create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
