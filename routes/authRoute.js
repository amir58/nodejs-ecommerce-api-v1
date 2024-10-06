const express = require( 'express' );

const {
    signupValidator,
    loginValidator,
    forgetPasswordValidator,
} = require( '../utils/validators/authValidators' );

const {
    signup,
    login,
    forgetPassword,
    verifyPassResetCode,
} = require( '../services/authService' );


const router = express.Router();

router
    .route( '/signup' )
    .post( signupValidator, signup );

router.route( '/login' ).post( loginValidator, login );

router.post( '/forgetPassword', forgetPasswordValidator, forgetPassword );
router.post( '/verifyResetCode', verifyPassResetCode );

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