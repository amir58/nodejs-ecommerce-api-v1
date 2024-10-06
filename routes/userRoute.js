const express = require( 'express' );

const { protect, allowTo } = require( "../services/authService" );

const {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    changeUserPasswordValidator,
    deleteUserValidator,
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
} = require( '../services/userService' );


const router = express.Router();

router.use(
    protect,
    // allowTo( "admin", "manager" ),
);

router.get( '/profile', getLoggedUserData );

router
    .route( '/' )
    .get(
        // protect,
        allowTo( "admin", "manager" ),
        getUsers,
    )
    .post(
        // protect,
        allowTo( "admin" ),
        uploadUserImage, resizeImage, createUserValidator, createUser );

router
    .route( '/:id' )
    .get(
        // protect,
        allowTo( "admin", "manager" ),
        getUserValidator,
        getUser )
    .put(
        // protect,
        allowTo( "admin" ),
        uploadUserImage,
        resizeImage,
        updateUserValidator,
        updateUser,
    )
    .delete(
        // protect,
        allowTo( "admin" ),
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