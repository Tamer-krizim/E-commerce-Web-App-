const { default: mongoose } = require("mongoose");
const mogoosse = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      requierd: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [240, "Too short product title"],
    },
    slug: {
      type: String,
      require: true,
      lowercase: true,
    },
    description: {
      type: String,
      requierd: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      requierd: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      requierd: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
      requierd: false,
    },
    colors: [String],
    imageCover: {
      type: String,
      requierd: [true, "Product image cove is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      requierd: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be blow or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mogoosse.model("Product", productSchema);
