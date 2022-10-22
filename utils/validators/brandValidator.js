const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
/**
 * @desc Validator Rules for GET Category by id
 */
exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID foramt"),
  validatorMiddleware,
];

/**
 * @desc Validator Rules for Create Brand by id
 */
exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand is required")
    .isLength({ min: 3 })
    .withMessage("Too short Brand name")
    .isLength({ max: 32 })
    .withMessage("Too long Brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

/**
 * @desc Validator Rules for update Brand by id
 */
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID foramt"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

/**
 * @desc Validator Rules for Delete Brand by id
 */
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID foramt"),
  validatorMiddleware,
];
