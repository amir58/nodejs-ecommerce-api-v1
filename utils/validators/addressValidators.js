
const { check } = require( 'express-validator' );

const validatorMiddleware = require( '../../middlewares/validatorMiddleware' );


exports.addAddressValidator = [
    check( 'alias' )
        .notEmpty()
        .withMessage( 'Alias is required' ),

    check( 'details' )
        .notEmpty()
        .withMessage( 'Details is required' ),

    check( 'phone' )
        .notEmpty()
        .withMessage( 'Phone is required' )
        .isMobilePhone( [ 'ar-EG' ] )
        .withMessage( 'Invalid phone number only accepted Egypt Phone numbers' ),

    check( 'postalCode' )
        .notEmpty()
        .withMessage( 'Postal code is required' )
        .isInt()
        .withMessage( 'Postal code must be an integer' )
        .isLength( { min: 5, max: 5 } )
        .withMessage( 'Postal code must be exactly 5 digits.' ),

    validatorMiddleware,
];

exports.removeAddressValidator = [
    check( 'addressId' )
        .notEmpty()
        .withMessage( 'Address id is required' )
        .isMongoId()
        .withMessage( 'Invalid address id' ),

    validatorMiddleware,
];

