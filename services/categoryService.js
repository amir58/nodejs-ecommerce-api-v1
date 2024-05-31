const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  var page = req.query.page * 1 || 1;
  var limit = req.query.limit * 1 || 3;
  var skip = (page - 1) * limit;

  const categories = await CategoryModel.find({}).limit(limit).skip(skip);

  res.status(200).json({ results: categories.length, page, data: categories });
  // res.send({ code: 200, message: "success", data: categories });
});

// @desc    Get specific category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await CategoryModel.findById(id);

  if (!category) {
    res.status(404).json({ msg: `Category not found` });
  }

  res.status(200).json({ data: category });
});

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});
