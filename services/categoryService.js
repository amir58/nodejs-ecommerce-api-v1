const asyncHandler = require( "express-async-handler" );
const Category = require( "../models/categoryModel" );
const ApiFetaures = require( "../utils/apiFeatures" );
const factory = require( "./handlersFactory" );

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = factory.createOne( Category );


// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler( async ( req, res ) => {
  const countDocuments = await Category.countDocuments();

  const apiFeatures = new ApiFetaures( Category.find(), req.query );

  apiFeatures
    .paginate( countDocuments )
    .filter()
    .sort()
    .limitFields()
    .search();

  const { mongooseQuery, pagingResults } = apiFeatures;
  const categories = await mongooseQuery;

  res.status( 200 ).json( { results: categories.length, pagingResults, data: categories } );
  // res.send({ code: 200, message: "success", data: categories });
} );

// @desc    Get specific category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne( Category );

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne( Category );

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne( Category );
