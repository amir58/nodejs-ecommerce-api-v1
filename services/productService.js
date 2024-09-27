const slugify = require( "slugify" );
const asyncHandler = require( "express-async-handler" );
const Product = require( "../models/productModel" );
const ApiError = require( "../utils/apiError" );
const ApiFetaures = require( "../utils/apiFeatures" );
const factory = require( "./handlersFactory" );

// @desc    Create Product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = factory.createOne( Product );


// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler( async ( req, res ) => {
  const countDocuments = await Product.countDocuments();

  const apiFeatures = new ApiFetaures( Product.find(), req.query );

  apiFeatures
    .paginate( countDocuments )
    .filter()
    .sort()
    .limitFields()
    .search();
  // .populate( { path: "category", select: "name" } );

  const { mongooseQuery, pagingResults } = apiFeatures;
  const products = await mongooseQuery;

  res.status( 200 ).json( {
    results: products.length,
    pagingResults,
    data: products
  } );

} );

// @desc    Get specific Product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler( async ( req, res, next ) => {
  const { id } = req.params;

  const product = await Product.findById( id )
    .populate( { path: "category", select: "name" } );

  if ( !product ) {
    // res.status(405).json({ msg: `Product not found` });
    return next( new ApiError( `Product not found`, 404 ) );
  }

  res.status( 200 ).json( { data: product } );
} );

// @desc    Update Product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne( Product );
// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne( Product );

