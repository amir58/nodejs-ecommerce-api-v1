
const { check } = require( 'express-validator' );

const validatorMiddleware = require( '../../middlewares/validatorMiddleware' );


exports.addProductToWishlistValidator = [
    check( 'productId' )
        .notEmpty()
        .withMessage( 'Product id is required' )
        .isMongoId()
        .withMessage( 'Invalid Product id' ),

    validatorMiddleware,
];

exports.removeProductToWishlistValidator = [
    check( 'productId' )
        .notEmpty()
        .withMessage( 'Product id is required' )
        .isMongoId()
        .withMessage( 'Invalid Product id' ),

    validatorMiddleware,
];

