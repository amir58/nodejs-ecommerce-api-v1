
const { check } = require( 'express-validator' );
const validatorMiddleware = require( '../../middlewares/validatorMiddleware' );

exports.getProductValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid Product id' ),
    validatorMiddleware,
];

exports.createProductValidator = [
    check( 'title' )
        .notEmpty()
        .withMessage( 'Product name is required' )
        .isLength( { min: 3, } )
        .withMessage( 'Too short Product name' )
        .isLength( { max: 32 } )
        .withMessage( 'Too long Product name' ),

    check( 'description' )
        .notEmpty()
        .withMessage( 'Product description is required' )
        .isLength( { min: 20, } )
        .withMessage( 'Too short Product description' )
        .isLength( { max: 300 } )
        .withMessage( 'Too long Product description' ),

    check( 'quantity' )
        .notEmpty()
        .withMessage( 'Product quantity is required' )
        .isNumeric()
        .withMessage( 'Product quantity must be a number' ),

    check( 'price' )
        .notEmpty()
        .withMessage( 'Product price is required' )
        .isNumeric()
        .withMessage( 'Product price must be a number' )
        .isLength( { max: 32 } )
        .withMessage( 'Too long Product price' ),

    check( 'priceAfterDiscount' )
        .optional()
        .toFloat()
        .isNumeric()
        .withMessage( 'Product price after discount must be a number' )
        .isLength( { max: 32 } )
        .withMessage( 'Too long Product price' )
        .custom( ( value, { req } ) => {
            if ( value < req.body.price ) {
                throw new Error( 'Product price after discount must be greater than or equal to Product price' );
            }
        } ),

    check( 'colors' )
        .optional()
        .isArray()
        .withMessage( 'Product colors must be an array' ),

    check( 'imageCover' )
        .notEmpty()
        .withMessage( 'Product image cover is required' ),

    check( 'images' )
        .optional()
        .isArray()
        .withMessage( 'Product images must be an array' ),

    check( 'category' )
        .notEmpty()
        .withMessage( 'Product category is required' )
        .isMongoId()
        .withMessage( 'Invalid category id' ),

    check( 'subCategory' )
        .optional()
        .isMongoId()
        .withMessage( 'Invalid subCategory id' ),

    check( 'brand' )
        .optional()
        .isMongoId()
        .withMessage( 'Invalid brand id' ),

    check( 'ratingsAverage' )
        .optional()
        .isNumeric()
        .withMessage( 'Product ratings average must be a number' )
        .isLength( { min: 1 } )
        .withMessage( 'Product ratings averag must be more than 0' )
        .isLength( { max: 5 } )
        .withMessage( 'Product ratings averag must be less than or equal to 5' )
    ,

    check( 'ratingsQuantity' )
        .optional()
        .isNumeric()
        .withMessage( 'Product ratings quantity must be a number' ),

    validatorMiddleware,
];

exports.updateProductValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid Product id' ),
    validatorMiddleware,
];

exports.deleteProductValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid Product id' ),
    validatorMiddleware,
];
