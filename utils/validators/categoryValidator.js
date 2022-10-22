const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
/**
 * @desc Validator Rules for GET Category by id
 */
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID foramt"),
  validatorMiddleware,
];

/**
 * @desc Validator Rules for Create Category by id
 */
exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

/**
 * @desc Validator Rules for update Category by id
 */
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID foramt"),
  body("title")
    .isOctal()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

/**
 * @desc Validator Rules for Delete Category by id
 */
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID foramt"),
  validatorMiddleware,
];
