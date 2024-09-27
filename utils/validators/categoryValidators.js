
const { check, body } = require( 'express-validator' );
const slugify = require( "slugify" );
const validatorMiddleware = require( '../../middlewares/validatorMiddleware' );

exports.getCategoryValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid category id' ),
    validatorMiddleware,
];

exports.createCategoryValidator = [
    check( 'name' )
        .notEmpty()
        .withMessage( 'Category name is required' )
        .isLength( { min: 3, } )
        .withMessage( 'Too short category name' )
        .isLength( { max: 32 } )
        .withMessage( 'Too long category name' ),

    validatorMiddleware,
];

exports.updateCategoryValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid category id' ),
    body( 'name' )
        .optional()
        .custom( ( value, { req } ) => {
            req.body.slug = slugify( value );
            return true;
        } ),
    validatorMiddleware,
];

exports.deleteCategoryValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid category id' ),
    validatorMiddleware,
];
