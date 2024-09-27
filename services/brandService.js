const slugify = require( "slugify" );
const asyncHandler = require( "express-async-handler" );
const Brand = require( "../models/brandModel" );
const ApiError = require( "../utils/apiError" );
const ApiFetaures = require( "../utils/apiFeatures" );
const factory = require( "./handlersFactory" );

// @desc    Create Brand
// @route   POST /api/v1/brands
// @access  Private
exports.createBrand = asyncHandler( async ( req, res ) => {
  const { name } = req.body;
  const brand = await Brand.create( { name, slug: slugify( name ) } );
  res.status( 201 ).json( { data: brand } );
} );


// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = asyncHandler( async ( req, res ) => {
  const countDocuments = await Brand.countDocuments();

  const apiFeatures = new ApiFetaures( Brand.find(), req.query );

  apiFeatures
    .paginate( countDocuments )
    .filter()
    .sort()
    .limitFields()
    .search();

  const { mongooseQuery, pagingResults } = apiFeatures;
  const brands = await mongooseQuery;

  res.status( 200 ).json( {
    results: brands.length,
    pagingResults,
    data: brands,
  } );
  // res.send({ code: 200, message: "success", data: brands });
} );

// @desc    Get specific Brand
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = asyncHandler( async ( req, res, next ) => {
  const { id } = req.params;

  const brand = await Brand.findById( id );

  if ( !brand ) {
    // res.status(405).json({ msg: `Brand not found` });
    return next( new ApiError( `Brand not found`, 404 ) );
  }

  res.status( 200 ).json( { data: brand } );
} );

// @desc    Update Brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = asyncHandler( async ( req, res, next ) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    {
      name,
      slug: slugify( name ),
    },
    { new: true }
  );

  if ( !brand ) {
    // res.status(404).json({ msg: `Brand not found` });
    return next( new ApiError( `Brand not found`, 404 ) );
  }

  res.status( 200 ).json( { data: brand } );
} );

// @desc    Delete Brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne( Brand );

