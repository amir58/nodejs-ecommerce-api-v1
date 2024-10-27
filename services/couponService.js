const Coupon = require( "../models/couponModel" );
const factory = require( "./handlersFactory" );

// @desc    Create Coupon
// @route   POST /api/v1/coupons
// @access  Private/Protect/Admin
exports.createCoupon = factory.createOne( Coupon );

// @desc    Get list of coupons
// @route   GET /api/v1/coupons
// @access  Private/Protect/Admin
exports.getCoupons = factory.getAll( Coupon );

// @desc    Get specific Coupon
// @route   GET /api/v1/coupons/:id
// @access  Public
exports.getCoupon = factory.getOne( Coupon );
// @desc    Update Coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private
exports.updateCoupon = factory.updateOne( Coupon );

// @desc    Delete Coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private
exports.deleteCoupon = factory.deleteOne( Coupon );

