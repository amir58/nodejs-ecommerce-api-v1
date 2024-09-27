const slugify = require( "slugify" );
const asyncHandler = require( "express-async-handler" );
const Category = require( "../models/categoryModel" );
const ApiError = require( "../utils/apiError" );
const ApiFetaures = require( "../utils/apiFeatures" );
const factory = require( "./handlersFactory" );

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler( async ( req, res ) => {
  const { name } = req.body;
  const category = await Category.create( { name, slug: slugify( name ) } );
  res.status( 201 ).json( { data: category } );
} );


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
exports.getCategory = asyncHandler( async ( req, res, next ) => {
  const { id } = req.params;

  const category = await Category.findById( id );

  if ( !category ) {
    // res.status(405).json({ msg: `Category not found` });
    return next( new ApiError( `Category not found`, 404 ) );
  }

  res.status( 200 ).json( { data: category } );
} );

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne( Category );

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne( Category );
