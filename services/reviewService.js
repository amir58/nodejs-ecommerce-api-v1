const asyncHandler = require( "express-async-handler" );
const Review = require( "../models/reviewModel" );
const factory = require( "./handlersFactory" );

// Nested route : product and user
exports.setProductIdAndUserIdToBody = asyncHandler( async ( req, res, next ) => {
  if ( !req.body.product ) req.body.product = req.params.productId;
  if ( !req.body.user ) req.body.user = req.user._id;

  next();
} )

// @desc    Create Review
// @route   POST /api/v1/Review
// @access  Private/Protect/User
exports.createReview = factory.createOne( Review );


// Nested route : filter object
exports.createFilterObject = asyncHandler( async ( req, res, next ) => {
  let filterObject = {};
  if ( req.params.productId ) filterObject = { product: req.params.productId };
  req.filterObject = filterObject;
  next();
} )

// @desc    Get list of Reviews
// @route   GET /api/v1/Reviews
// @access  Public
exports.getReviews = factory.getAll( Review );

// @desc    Get specific Review
// @route   GET /api/v1/Reviews/:id
// @access  Public
exports.getReview = factory.getOne( Review );
// @desc    Update Review
// @route   PUT /api/v1/Reviews/:id
// @access  Private/Protect/User
exports.updateReview = factory.updateOne( Review );

// @desc    Delete Review
// @route   DELETE /api/v1/Reviews/:id
// @access  Private/Protect/User-Manager-Admin
exports.deleteReview = factory.deleteOne( Review );

