const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures/apiFeatures");
const factory = require("./handlerFactory");

const SubCategory = require("../modules/subCategoryModel");

// Middleware
exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

/**
 * @desc Get list of SubCategories
 * @route GET /api/v1/subcategories
 * @access Public
 */
exports.getSubCategories = asyncHandler(async (req, res) => {
  // Building the query
  const docCount = await SubCategory.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .paginate(docCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginateResult } = apiFeatures;
  const subCategories = await mongooseQuery;

  res.status(200).json({
    results: subCategories.length,
    paginateResult,
    data: subCategories,
  });
});

// Nested route
// GET /api/v1/categories/:categoryId/subcategory
exports.createfilterObj = (req, res, next) => {
  let filterObj = {};

  if (req.params.categoryId) filterObj = { category: req.params.categoryId };
  req.filterObj = filterObj;

  next();
};

/**
 * @desc Get specigic SubCategory by id
 * @route Get /api/v1/subcategories/id
 * @access Public
 */
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategories = await SubCategory.findById(id);
  if (!subCategories) {
    return next(new ApiError(`No SubCategory for this id: ${id}`, 404));
  }
  res.status(200).json({ data: subCategories });
});

/**
 * @desc Create SubCateory
 * @route POST   /api/v1/subcategories
 * @access Private
 */
exports.createSubCategory = factory.createOne(SubCategory);

/**
 * @desc Update specific subCategory
 * @rout PUT /api/v1/:id
 * @access Private
 */
exports.updateSubCategory = factory.updateOne(SubCategory);

/**
 * @desc Delete Specific subCategory
 * @rout Delete /api/v1/:id
 * @access Private
 */
exports.deleteSubCategory = factory.delteOne(SubCategory);
