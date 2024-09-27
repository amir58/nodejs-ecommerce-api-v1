
const { check, body } = require( 'express-validator' );
const slugify = require( "slugify" );
const validatorMiddleware = require( '../../middlewares/validatorMiddleware' );

exports.getSubCategoryValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid subCategory id' ),
    validatorMiddleware,
];

exports.createSubCategoryValidator = [
    check( 'name' )
        .notEmpty()
        .withMessage( 'subCategory name is required' )
        .isLength( { min: 2, } )
        .withMessage( 'Too short subCategory name' )
        .isLength( { max: 32 } )
        .withMessage( 'Too long subCategory name' )
        .custom( ( value, { req } ) => {
            req.body.slug = slugify( value );
            return true;
        } ),

    check( 'category' )
        .notEmpty().withMessage( 'Category is required' )
        .isMongoId().withMessage( 'Invalid Category id' ),

    validatorMiddleware,
];

exports.updateSubCategoryValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid subCategory id' ),
    body( 'name' )
        .optional()
        .custom( ( value, { req } ) => {
            req.body.slug = slugify( value );
            return true;
        } ),
    validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid subCategory id' ),
    validatorMiddleware,
];
