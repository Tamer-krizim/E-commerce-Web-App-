/* eslint-disable eqeqeq */
const { check } = require("express-validator");
const Category = require("../../modules/categoryModel");
const subCategory = require("../../modules/subCategoryModel");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price"),
  check("priceAfterdiscount")
    .optional()
    .default(null)
    .isNumeric()
    .withMessage("Product price after discount must be a number")
    .toFloat()
    .custom(),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Available Colors should be array of strings"),
  check("imageCover").notEmpty().withMessage("Product Image Cover is required"),
  check("image")
    .optional()
    .isArray()
    .withMessage("Images should be array of strings"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((categoryID) =>
      Category.findById(categoryID).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this ID: ${categoryID}`)
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((subcategoriesIds) =>
      subCategory
        .find({ _id: { $exists: true, $in: subcategoriesIds } })
        .then((result) => {
          if (result.length < 1 || result.length != subcategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subCategory ID`));
          }
        })
    ),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Ratings Average must be a number")
    .isLength({ min: 1 })
    .withMessage("Ratings Average must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Ratings Average must be below or equal 5.0"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("Rating Quantity must be a number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formte"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
