
const { check, body } = require( 'express-validator' );

const validatorMiddleware = require( '../../middlewares/validatorMiddleware' );

exports.createCouponValidator = [
    body( 'name' )
        .notEmpty()
        .withMessage( 'Coupon name is required' )
        .isLength( { min: 2, } )
        .withMessage( 'Too short coupon name' )
        .isLength( { max: 16 } )
        .withMessage( 'Too long coupon name' ),

    body( 'expire' )
        .notEmpty()
        .withMessage( 'Expire is required' )
        .isDate()
        .withMessage( 'Expire must be a date' ),

    body( 'discount' )
        .notEmpty()
        .withMessage( 'Discount is required' )
        .isNumeric()
        .withMessage( 'Discount must be a number' )
        .isLength( { min: 1 } )
        .withMessage( 'Discount must be at least 1 digit' )
        .isLength( { max: 3 } )
        .withMessage( 'Too long discount' ),

    validatorMiddleware,
];

exports.getCouponValidator = [
    check( 'id' )
        .isMongoId()
        .withMessage( 'Invalid coupon id' ),

    validatorMiddleware,
];

exports.updateCouponValidator = [
    check( 'id' )
        .isMongoId()
        .withMessage( 'Invalid coupon id' ),

    body( 'name' )
        .notEmpty()
        .withMessage( 'Coupon name is required' )
        .isLength( { min: 2, } )
        .withMessage( 'Too short coupon name' )
        .isLength( { max: 16 } )
        .withMessage( 'Too long coupon name' ),

    body( 'expire' )
        .notEmpty()
        .withMessage( 'Expire is required' )
        .isDate()
        .withMessage( 'Expire must be a date' ),

    body( 'discount' )
        .notEmpty()
        .withMessage( 'Discount is required' )
        .isInt()
        .withMessage( 'Discount must be a number' )
        .isLength( { min: 1 } )
        .withMessage( 'Discount must be at least 1 digit' )
        .isLength( { max: 3 } )
        .withMessage( 'Too long discount' ),

    validatorMiddleware,
];

exports.deleteCouponValidator = [
    check( 'id' )
        .isMongoId()
        .withMessage( 'Invalid coupon id' ),

    validatorMiddleware,
];
