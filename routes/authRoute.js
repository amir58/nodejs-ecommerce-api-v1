const express = require( 'express' );

const {
    signupValidator,
} = require( '../utils/validators/authValidators' );

const {
    signup,
} = require( '../services/authService' );


const router = express.Router();

router
    .route( '/signup' )
    .post( signupValidator, signup );

// router
//     .route( '/:id' )
//     .get( getUserValidator, getUser )
//     .put(
//         uploadUserImage,
//         resizeImage,
//         updateUserValidator,
//         updateUser,
//     )
//     .delete(
//         deleteUserValidator,
//         deleteUser
//     );

module.exports = router;