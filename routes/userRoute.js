const express = require( 'express' );

const authService = require( "../services/authService" );

const {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    changeUserPasswordValidator,
    deleteUserValidator,
    updateLoggedUserPasswordValidator,
} = require( '../utils/validators/userValidators' );

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    changeUserPassword,
    deleteUser,
    uploadUserImage,
    resizeImage,
    getLoggedUserData,
    updateLoggedUserPassword,
} = require( '../services/userService' );


const router = express.Router();

router.use(
    authService.protect,
    // allowTo( "admin", "manager" ),
);

router.get( '/profile', getLoggedUserData );
router.put(
    '/changeMyPassword',
    updateLoggedUserPasswordValidator,
    updateLoggedUserPassword,
);

router
    .route( '/' )
    .get(
        // protect,
        authService.allowTo( "admin", "manager" ),
        getUsers,
    )
    .post(
        // protect,
        authService.allowTo( "admin" ),
        uploadUserImage, resizeImage, createUserValidator, createUser );

router
    .route( '/:id' )
    .get(
        // protect,
        authService.allowTo( "admin", "manager" ),
        getUserValidator,
        getUser )
    .put(
        // protect,
        authService.allowTo( "admin" ),
        uploadUserImage,
        resizeImage,
        updateUserValidator,
        updateUser,
    )
    .delete(
        // protect,
        authService.allowTo( "admin" ),
        deleteUserValidator,
        deleteUser
    );

router
    .route( '/changePassword/:id' )
    .put(
        changeUserPasswordValidator,
        changeUserPassword
    );

module.exports = router;