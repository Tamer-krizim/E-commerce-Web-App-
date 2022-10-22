const asyncHandler = require("express-async-handler");
const { Model } = require("mongoose");
const ApiError = require("../utils/ApiError");

/**
 * @desc Delete Specific item
 * @rout Delete /api/v1/{service}/:id
 * @access Private
 */
exports.delteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No Document for this id: ${id}`, 404));
    }
    res.status(204).json();
  });

/**
 * @desc Update specific item
 * @rout PUT /api/v1/{service}/:id
 * @access Private
 */
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No Document for this id: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

/**
 * @desc Create item
 * @route POST   /api/v1/{service}
 * @access Private
 */

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    // async await syntax
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });
