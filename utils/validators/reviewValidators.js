
const { check, body } = require( 'express-validator' );
const slugify = require( "slugify" );

const validatorMiddleware = require( '../../middlewares/validatorMiddleware' );

exports.getReviewValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid Review id' ),
    validatorMiddleware,
];

exports.createReviewValidator = [
    check( 'comment' )
        .notEmpty()
        .withMessage( 'Review comment is required' )
        .isLength( { min: 3, } )
        .withMessage( 'Too short Review comment' )
        .isLength( { max: 32 } )
        .withMessage( 'Too long Review comment' )
        .custom( ( value, { req } ) => {
            req.body.slug = slugify( value );
            return true;
        } ),

    validatorMiddleware,
];

exports.updateReviewValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid Review id' ),
    body( 'comment' )
        .optional()
        .custom( ( value, { req } ) => {
            req.body.slug = slugify( value );
            return true;
        } ),
    validatorMiddleware,
];

exports.deleteReviewValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid Review id' ),
    validatorMiddleware,
];
