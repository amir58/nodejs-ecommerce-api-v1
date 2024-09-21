const slugify = require( "slugify" );
const asyncHandler = require( "express-async-handler" );
const ApiError = require( "../utils/apiError" );

const SubCategory = require( "../models/subCategoryModel" );

// @desc    Create a new sub category
// @route   POST /api/v1/subCategories
// @access  Private
exports.createSubCategory = asyncHandler( async ( req, res ) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create( {
    name, slug: slugify( name ), category,

  } );
  res.status( 201 ).json( { data: subCategory } );
} );

exports.createFilterObject = asyncHandler( async ( req, res, next ) => {
  let filterObject = {};
  if ( req.params.categoryId ) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
} )

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = asyncHandler( async ( req, res ) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 3;
  const skip = ( page - 1 ) * limit;

  const subCategories = await SubCategory
    .find( req.filterObject )
    .limit( limit )
    .skip( skip )
  // .populate( { path: "category", select: "name -_id" } );
  // .populate( { path: "category", select: "name" } );

  res.status( 200 ).json( { results: subCategories.length, page, data: subCategories } );
  // res.send({ code: 200, message: "success", data: categories });
} );

// @desc    Get specific SubCategory
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getSubCategory = asyncHandler( async ( req, res, next ) => {
  const { id } = req.params;

  const subCategory = await SubCategory
    .findById( id )
  // .populate( { path: "category", select: "name" } );

  if ( !subCategory ) {
    // res.status(405).json({ msg: `Category not found` });
    return next( new ApiError( `Category not found`, 404 ) );
  }

  res.status( 200 ).json( { data: subCategory } );
} );

// @desc    Update sub category
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = asyncHandler( async ( req, res, next ) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    {
      name,
      slug: slugify( name ),
      category,
    },
    { new: true }
  );

  if ( !subCategory ) {
    // res.status(404).json({ msg: `Category not found` });
    return next( new ApiError( `Sub Category not found`, 404 ) );
  }

  res.status( 200 ).json( { data: subCategory } );
} );

// @desc    Delete sub category
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = asyncHandler( async ( req, res, next ) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete( id );
  if ( !subCategory ) {
    // res.status(404).json({ msg: `Category not found` });
    return next( new ApiError( `Sub Category not found`, 404 ) );
  }

  res.status( 200 ).json( { msg: `Sub Category deleted` } );
} );
