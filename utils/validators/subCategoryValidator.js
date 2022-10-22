const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

/**
 * @desc Validator Rules for GET Category by id
 */
exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID foramt"),
  validatorMiddleware,
];

/**
 * @desc Validator Rules for Create SubCategory by id
 */
exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory is required")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("Too long Subcategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong  to category")
    .isMongoId()
    .withMessage("Invalid Category ID format"),
  validatorMiddleware,
];

/**
 * @desc Validator Rules for update SubCategory by id
 */
exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID foramt"),
  body("title")
    .isOctal()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

/**
 * @desc Validator Rules for Delete SubCategory by id
 */
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID foramt"),
  validatorMiddleware,
];
