const express = require( 'express' );

const {
    signupValidator,
    loginValidator,
    forgetPasswordValidator,
    resetPasswordValidator,
} = require( '../utils/validators/authValidators' );

const {
    signup,
    login,
    forgetPassword,
    verifyPassResetCode,
    resetPassword,
} = require( '../services/authService' );


const router = express.Router();

router
    .route( '/signup' )
    .post( signupValidator, signup );

router.route( '/login' ).post( loginValidator, login );

router.post( '/forgetPassword', forgetPasswordValidator, forgetPassword );
router.post( '/verifyResetCode', verifyPassResetCode );
router.post( '/resetPassword', resetPasswordValidator, resetPassword );

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