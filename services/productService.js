const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

const Product = require("../modules/productModel");
const CategoryModel = require("../modules/categoryModel");

/**
 * @desc Get list of All Products
 * @route GET /api/v1/products
 * @access Public
 */
exports.getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const products = await Product.find({})
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name" });

  res.status(200).json({ results: products.length, page, data: products });
});

/**
 * @desc Get specigic Product by id
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
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);

  // async await syntax
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

/**
 * @desc Update specific Product
 * @rout PUT /api/v1/products/:id
 * @access Private
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!product) {
    return next(new ApiError(`No Product for this id: ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

/**
 * @desc Delete Specific Product
 * @rout Delete /api/v1/products/:id
 * @access Private
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return next(new ApiError(`No Product for this id: ${id}`, 404));
  }
  res.status(204).json();
});
