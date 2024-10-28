
const { check, body } = require( 'express-validator' );

const validatorMiddleware = require( '../../middlewares/validatorMiddleware' );


exports.addProductToCartValidator = [
    body( 'productId' )
        .isMongoId()
        .withMessage( 'Invalid product id' ),

    body( 'color' )
        .notEmpty()
        .withMessage( 'Color is required' )
        .isString()
        .withMessage( 'Color must be a string' ),

    validatorMiddleware,
];

exports.updateCartItemValidator = [
    check( 'cartItemId' )
        .isMongoId()
        .withMessage( 'Invalid cart item id' ),

    body( 'quantity' )
        .notEmpty()
        .withMessage( 'Quatity is required' )
        .isInt()
        .withMessage( 'Quatity must be a number' ),

    validatorMiddleware,
];

exports.removeCartItemValidator = [
    check( 'cartItemId' )
        .isMongoId()
        .withMessage( 'Invalid cart item id' ),

    validatorMiddleware,
];

exports.applyCouponValidator = [
    body( 'coupon' )
        .notEmpty()
        .withMessage( 'Coupon is required' )
        .isString()
        .withMessage( 'Coupon must be a string' ),

    validatorMiddleware,
];

