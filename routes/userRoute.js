const express = require( 'express' );

const {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
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
} = require( '../services/userService' );


const router = express.Router();

router
    .route( '/' )
    .get( getUsers )
    .post( uploadUserImage, resizeImage, createUserValidator, createUser );

router
    .route( '/:id' )
    .get( getUserValidator, getUser )
    .put(
        uploadUserImage,
        resizeImage,
        updateUserValidator,
        updateUser,
    )
    .delete(
        deleteUserValidator,
        deleteUser
    );

router
    .route( '/changePassword/:id' )
    .put(
        // updateUserValidator,
        changeUserPassword
    );

module.exports = router;