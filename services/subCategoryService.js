const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const SubCategory = require("../models/subCategoryModel");

// @desc    Create a new sub category
// @route   POST /api/v1/subCategories
// @access  Private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name, slug: slugify(name), category,

  });
  res.status(201).json({ data: subCategory });
});

