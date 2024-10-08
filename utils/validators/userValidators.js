const slugify = require( 'slugify' );
const { check, body } = require( 'express-validator' );
const bcrypt = require( 'bcryptjs' );
const validatorMiddleware = require( '../../middlewares/validatorMiddleware' );
const User = require( '../../models/userModel' );

exports.createUserValidator = [
    check( 'name' )
        .notEmpty()
        .withMessage( 'User required' )
        .isLength( { min: 3 } )
        .withMessage( 'Too short User name' )
        .custom( ( val, { req } ) => {
            req.body.slug = slugify( val );
            return true;
        } ),

    check( 'email' )
        .notEmpty()
        .withMessage( 'Email required' )
        .isEmail()
        .withMessage( 'Invalid email address' )
        .custom( ( val ) =>
            User.findOne( { email: val } ).then( ( user ) => {
                if ( user ) {
                    return Promise.reject( new Error( 'E-mail already in use' ) );
                }
            } )
        ),

    check( 'password' )
        .notEmpty()
        .withMessage( 'Password required' )
        .isLength( { min: 6 } )
        .withMessage( 'Password must be at least 6 characters' )
        .custom( ( password, { req } ) => {
            if ( password !== req.body.passwordConfirm ) {
                throw new Error( 'Password Confirmation incorrect' );
            }
            return true;
        } ),

    check( 'passwordConfirm' )
        .notEmpty()
        .withMessage( 'Password confirmation required' ),

    check( 'phone' )
        .optional()
        .isMobilePhone( [ 'ar-EG', 'ar-SA' ] )
        .withMessage( 'Invalid phone number only accepted Egy and SA Phone numbers' ),

    check( 'profileImg' ).optional(),
    check( 'role' ).optional(),

    validatorMiddleware,
];

exports.getUserValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid User id format' ),
    validatorMiddleware,
];

exports.updateUserValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid User id format' ),

    body( 'name' )
        .optional()
        .custom( ( val, { req } ) => {
            req.body.slug = slugify( val );
            return true;
        } ),

    check( 'email' )
        .notEmpty()
        .withMessage( 'Email required' )
        .isEmail()
        .withMessage( 'Invalid email address' )
        .custom( ( val ) =>
            User.findOne( { email: val } ).then( ( user ) => {
                if ( user ) {
                    return Promise.reject( new Error( 'E-mail already in user' ) );
                }
            } )
        ),

    check( 'phone' )
        .optional()
        .isMobilePhone( [ 'ar-EG', 'ar-SA' ] )
        .withMessage( 'Invalid phone number only accepted Egy and SA Phone numbers' ),

    check( 'profileImg' ).optional(),

    check( 'role' ).optional(),

    validatorMiddleware,
];

exports.changeUserPasswordValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid User id format' ),

    check( 'currentPassword' )
        .notEmpty()
        .withMessage( 'Current Password required' ),

    check( 'password' )
        .notEmpty()
        .withMessage( 'Password required' )
        .isLength( { min: 6 } )
        .withMessage( 'Password must be at least 6 characters' ),

    check( 'passwordConfirm' )
        .notEmpty()
        .withMessage( 'Password confirmation required' )
        .custom( async ( val, { req } ) => {
            const user = await User.findById( req.params.id )

            if ( !user ) {
                return Promise.reject( new Error( 'User not found' ) );
            }

            const isCurrentPasswordNotValid = !await bcrypt.compare( req.body.currentPassword, user.password );

            if ( isCurrentPasswordNotValid ) {
                return Promise.reject( new Error( 'Current Password not valid' ) );
            }

            if ( req.body.password !== req.body.passwordConfirm ) {
                return Promise.reject( new Error( 'Password Confirmation incorrect' ) );
            }
            return true;
        }
        ),

    validatorMiddleware,
];

exports.deleteUserValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid User id format' ),

    validatorMiddleware,
];

exports.updateLoggedUserPasswordValidator = [
    check( 'password' )
        .notEmpty()
        .withMessage( 'Password required' )
        .isLength( { min: 6 } )
        .withMessage( 'Password must be at least 6 characters' ),

    check( 'passwordConfirm' )
        .notEmpty()
        .withMessage( 'Password confirmation required' )
        .custom( async ( val, { req } ) => {
            const user = await User.findById( req.user.id )

            if ( !user ) {
                return Promise.reject( new Error( 'User not found' ) );
            }

            if ( req.body.password !== req.body.passwordConfirm ) {
                return Promise.reject( new Error( 'Password Confirmation incorrect' ) );
            }
            return true;
        }
        ),

    validatorMiddleware,
];

exports.updateLoggedUserValidator = [
    body( 'name' )
        .optional()
        .custom( ( val, { req } ) => {
            req.body.slug = slugify( val );
            return true;
        } ),

    check( 'email' )
        .optional()

        .isEmail()
        .withMessage( 'Invalid email address' )
        .custom( ( val ) =>
            User.findOne( { email: val } ).then( ( user ) => {
                if ( user ) {
                    return Promise.reject( new Error( 'E-mail already in user' ) );
                }
            } )
        ),

    check( 'phone' )
        .optional()
        .isMobilePhone( [ 'ar-EG', 'ar-SA' ] )
        .withMessage( 'Invalid phone number only accepted Egy and SA Phone numbers' ),


    validatorMiddleware,
];
