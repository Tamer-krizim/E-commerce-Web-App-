const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
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
 * @desc Create SubCateory
 *
 * @route POST   /api/v1/subcategories
 * @access Private
 */
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  // async await syntax
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
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
 * @desc Get list of SubCategories
 * @route GET /api/v1/subcategories
 * @access Public
 */
exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategory.find(req.filterObj)
    .skip(skip)
    .limit(limit);
  // .populate({ path: "category", select: "name -_id" });
  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

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
 * @desc Update specific subCategory
 * @rout PUT /api/v1/:id
 * @access Private
 */
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );

  if (!subCategory) {
    return next(new ApiError(`No SubCategory for this id: ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

/**
 * @desc Delete Specific subCategory
 * @rout Delete /api/v1/:id
 * @access Private
 */
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findByIdAndDelete(id);

  if (!subCategory) {
    return next(new ApiError(`No SubCategory for this id: ${id}`, 404));
  }
  res.status(204).json();
});
