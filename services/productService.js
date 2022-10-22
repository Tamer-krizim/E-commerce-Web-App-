const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures/apiFeatures");
const factory = require("./handlerFactory");

const Product = require("../modules/productModel");

/**
 * @desc Get list of All Products
 * @route GET /api/v1/products
 * @access Public
 */
exports.getProducts = asyncHandler(async (req, res) => {
  // Building the query
  const docCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .paginate(docCount)
    .filter()
    .search("Products")
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginateResult } = apiFeatures;
  const products = await mongooseQuery;

  res
    .status(200)
    .json({ results: products.length, paginateResult, data: products });
});

/**
 * @desc Get Specigic Product by id
 * @route Get /api/v1/products/id
 * @access Public
 */
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name",
  });

  if (!product) {
    return next(new ApiError(`No Product for this id: ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

/**
 * @desc Create Product
 *
 * @route POST   /api/v1/products
 * @access Private
 */
exports.createProduct = factory.createOne(Product);

/**
 * @desc Update specific Product
 * @rout PUT /api/v1/products/:id
 * @access Private
 */
exports.updateProduct = factory.updateOne(Product);

/**
 * @desc Delete Specific Product
 * @rout Delete /api/v1/products/:id
 * @access Private
 */
exports.deleteProduct = factory.delteOne(Product);
