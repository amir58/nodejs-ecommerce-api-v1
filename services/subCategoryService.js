const asyncHandler = require( "express-async-handler" );
const factory = require( "./handlersFactory" );

const SubCategory = require( "../models/subCategoryModel" );

// Nested route : category
exports.setCategoryIdToBody = asyncHandler( async ( req, res, next ) => {
  if ( !req.body.category ) req.body.category = req.params.categoryId;
  next();
} )

// Nested route : filter object
exports.createFilterObject = asyncHandler( async ( req, res, next ) => {
  let filterObject = {};
  if ( req.params.categoryId ) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
} )

// @desc    Create a new sub category
// @route   POST /api/v1/subCategories
// @access  Private
exports.createSubCategory = factory.createOne( SubCategory );

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = factory.getAll( SubCategory );

// @desc    Get specific SubCategory
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getSubCategory = factory.getOne( SubCategory );

// @desc    Update sub category
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = factory.updateOne( SubCategory );

// @desc    Delete sub category
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne( SubCategory );
