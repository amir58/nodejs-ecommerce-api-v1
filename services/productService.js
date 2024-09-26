const slugify = require( "slugify" );
const asyncHandler = require( "express-async-handler" );
const Product = require( "../models/productModel" );
const ApiError = require( "../utils/apiError" );

// @desc    Create Product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = asyncHandler( async ( req, res ) => {
  req.body.slug = slugify( req.body.title );
  const product = await Product.create( req.body );
  res.status( 201 ).json( { data: product } );
} );


// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler( async ( req, res ) => {
  // 1) Filtering
  const queryStringObject = { ...req.query };
  const excludeFields = [ "sort", "page", "limit", "fields" ];
  excludeFields.forEach( field => delete queryStringObject[ field ] );
  // Apply filtering using [gte, gt, lte, lt]
  let queryStr = JSON.stringify( queryStringObject );
  queryStr = queryStr.replace( /\b(gte|gt|lte|lt)\b/g, match => `$${ match }` );

  // 2) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 3;
  const skip = ( page - 1 ) * limit;

  // Build query
  let mongooseQuery = Product.find( JSON.parse( queryStr ) )
    .limit( limit )
    .skip( skip )
    .populate( { path: "category", select: "name" } );

  // 3) Sorting
  if ( req.query.sort ) {
    const sortBy = req.query.sort.split( "," ).join( " " );
    mongooseQuery = mongooseQuery.sort( sortBy );
  } else {
    mongooseQuery = mongooseQuery.sort( "-createdAt" );
  }

  // 4) Field limiting
  if ( req.query.fields ) {
    const fields = req.query.fields.split( "," ).join( " " );
    mongooseQuery = mongooseQuery.select( fields );
  }
  else {
    mongooseQuery = mongooseQuery.select( "-__v" );
  }

  // Executing query
  const products = await mongooseQuery;

  res.status( 200 ).json( { results: products.length, page, data: products } );
  // res.send({ code: 200, message: "success", data: products });
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
exports.updateProduct = asyncHandler( async ( req, res, next ) => {
  const { id } = req.params;

  if ( req.body.title ) {
    req.body.slug = slugify( req.body.title );
  }

  const product = await Product.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );

  if ( !product ) {
    // res.status(404).json({ msg: `Product not found` });
    return next( new ApiError( `Product not found`, 404 ) );
  }

  res.status( 200 ).json( { data: product } );
} );

// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = asyncHandler( async ( req, res, next ) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete( id );
  if ( !product ) {
    // res.status(404).json({ msg: `Product not found` });
    return next( new ApiError( `Product not found`, 404 ) );
  }

  res.status( 200 ).json( { msg: `Product deleted` } );
} );

