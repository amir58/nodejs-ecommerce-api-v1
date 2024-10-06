const asyncHandler = require( 'express-async-handler' );
const jwt = require( 'jsonwebtoken' );
const bcrypt = require( 'bcryptjs' );
const crypto = require( 'crypto' );
const sendEmail = require( '../utils/sendEmail' );
const ApiError = require( '../utils/apiError' );
const User = require( '../models/userModel' );

// @desc    Signup 
// @route   POST  /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler( async ( req, res ) => {
    const document = await User.create( {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        // profileImg: req.body.profileImg,
        // role: req.body.role
    } );

    const token = jwt.sign(
        { userId: document._id },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRE_TIME
        }
    );

    res.status( 201 ).json( {
        data: document,
        token: token,
    } );

} );


// @desc    Login 
// @route   POST  /api/v1/auth/login
// @access  Public
exports.login = asyncHandler( async ( req, res, next ) => {
    const user = await User.findOne( {
        email: req.body.email,
    } );


    if ( !user || !( await bcrypt.compare( req.body.password, user.password ) ) ) {
        return next( new ApiError( `invalid credentials`, 401 ) );
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRE_TIME
        }
    );

    res.status( 200 ).json( {
        data: user,
        token: token,
    } );

} );


// @desc    Login 
// @route   POST  /api/v1/auth/login
// @access  Public
exports.protect = asyncHandler( async ( req, res, next ) => {
    // 1) Check token if it exists
    let token;
    if ( req.headers.authorization && req.headers.authorization.startsWith( 'Bearer' ) ) {
        token = req.headers.authorization.split( ' ' )[ 1 ];
    }

    if ( !token ) {
        return next( new ApiError( `Not authorized to access this route`, 401 ) );
    }

    // 2) Verify token ( no changes happen , expiration time )
    const decoded = jwt.verify( token, process.env.JWT_SECRET_KEY );
    // 3) Check if user still exists

    const user = await User.findById( decoded.userId );
    if ( !user ) {
        return next( new ApiError( `The user belonging to this token does no longer exist`, 401 ) );
    }

    // 4) Check if user changed password after the token was craeted

    if ( user.passwordChangedAt ) {
        const passwordChangedAt = parseInt( user.passwordChangedAt.getTime() / 1000, 10 );

        if ( passwordChangedAt > decoded.iat ) {
            return next( new ApiError( `User recently changed password. Please login again`, 401 ) );
        }
    }

    // 5) By Amir => Check is user active or not
    if ( !user.active ) {
        return next( new ApiError( `User with this email is not active`, 401 ) );
    }

    req.user = user

    next();
} );

exports.allowTo = ( ...roles ) => asyncHandler( ( req, res, next ) => {
    console.log( req.user.role );
    if ( !roles.includes( req.user.role ) ) {
        return next( new ApiError( `You don't have permission to perform this action`, 403 ) );
    }
    next();
}
);


exports.forgetPassword = asyncHandler( async ( req, res, next ) => {
    const user = await User.findOne( { email: req.body.email } );
    if ( !user ) {
        return next( new ApiError( `There is no user with this email`, 404 ) );
    }

    const resetCode = Math.floor( 100000 + Math.random() * 900000 ).toString();
    const hashedResetCode = crypto
        .createHash( "sha256" )
        .update( resetCode )
        .digest( "hex" );

    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;

    await user.save();

    const message = `Hi ${ user.name }, 
    \n We received a request to reset your password on out E-Shop account.
    \n Your password reset code is: ${ resetCode } 
    \n Valid for 10 minutes. 
    \n If you did not request a password reset, please ignore this email.`;

    try {
        await sendEmail( {
            email: user.email,
            subject: "Password Reset Code",
            message: message
        } );
    } catch ( err ) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save();
        return next( new ApiError( `Email could not be sent`, 500 ) );
    }

    res.status( 200 ).json( {
        status: "success",
        message: "Reset code sent to your email",
    } );
} );

exports.verifyPassResetCode = asyncHandler( async ( req, res, next ) => {

    const hashedResetCode = crypto
        .createHash( "sha256" )
        .update( req.body.resetCode )
        .digest( "hex" );


    const user = await User.findOne( {
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() }
    } );

    if ( !user ) {
        return next( new ApiError( `Resest code is invalid or has expired`, 404 ) );
    }

    console.log( user );
    user.passwordResetVerified = true;
    await user.save();
    console.log( user );

    res.status( 200 ).json( {
        status: "success",
        message: "Reset code verified",
    } );

} );

exports.resetPassword = asyncHandler( async ( req, res, next ) => {
    const user = await User.findOne( {
        email: req.body.email,
    } );

    if ( !user ) {
        return next( new ApiError( `Resest code is invalid or has expired`, 404 ) );
    }

    user.password = req.body.password;
    user.passwordChangedAt = Date.now();
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME
    } );

    res.status( 200 ).json( {
        status: "success",
        message: "Password changed successfully",
        token: token,
    } );

} );
