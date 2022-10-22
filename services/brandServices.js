const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures/apiFeatures");
const factory = require("./handlerFactory");

const Brand = require("../modules/brandModel");

/**
 * @desc Get list of Brands
 * @route GET /api/v1/brands
 * @access Public
 */
exports.getBrands = asyncHandler(async (req, res) => {
  // Building the query
  const docCount = await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .paginate(docCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginateResult } = apiFeatures;
  const brands = await mongooseQuery;

  res
    .status(200)
    .json({ results: brands.length, paginateResult, data: brands });
});

/**
 * @desc Get specigic Brand by id
 * @route Get /api/v1/brand/id
 * @access Public
 */
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ApiError(`No Brand for this id: ${id}`, 404));
  }
  res.status(200).json({ results: brand.length, data: brand });
});

/**
 * @desc Create Brand
 *
 * @route POST   /api/v1/Brand
 * @access Private
 */
exports.createBrand = factory.createOne(Brand);

/**
 * @desc Update specific brand
 * @rout PUT /api/v1/brand/:id
 * @access Private
 */
exports.updateBrand = factory.updateOne(Brand);

/**
 * @desc Delete Specific Category
 * @rout Delete /api/v1/:id
 * @access Private
 */
exports.deleteBrand = factory.delteOne(Brand);
