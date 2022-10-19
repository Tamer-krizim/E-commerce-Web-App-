const mongoose = require("mongoose");

// create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand Required"],
      unique: [true, "Brand must be unique"],
      minlenght: [3, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
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
module.exports = mongoose.model("Brand", brandSchema);
