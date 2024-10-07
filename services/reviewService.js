const Review = require( "../models/reviewModel" );
const factory = require( "./handlersFactory" );


// @desc    Create Review
// @route   POST /api/v1/Review
// @access  Private/Protect/User
exports.createReview = factory.createOne( Review );

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

