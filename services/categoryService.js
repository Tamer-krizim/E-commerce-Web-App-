const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures/apiFeatures");
const factory = require("./handlerFactory");

const Category = require("../modules/categoryModel");

/**
 * @desc Get list of categories
 * @route GET /api/v1/categories
 * @access Public
 */
exports.getCategories = asyncHandler(async (req, res) => {
  // Building the query
  const docCount = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .paginate(docCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginateResult } = apiFeatures;
  const categories = await mongooseQuery;

  res
    .status(200)
    .json({ results: categories.length, paginateResult, data: categories });
});

/**
 * @desc Get specigic category bu id
 * @route Get /api/v1/categories/id
 * @access Public
 */
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError(`No Category for this id: ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

/**
 * @desc Create Cateory
 *
 * @route POST   /api/v1/categories
 * @access Private
 */
exports.createCategory = factory.createOne(Category);

/**
 * @desc Update specific category
 * @rout PUT /api/v1/categories/:id
 * @access Private
 */
exports.updateCategory = factory.updateOne(Category);

/**
 * @desc Delete Specific Category
 * @rout Delete /api/v1/categories/:id
 * @access Private
 */
exports.deleteCategory = factory.delteOne(Category);
