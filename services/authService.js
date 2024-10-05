const asyncHandler = require( 'express-async-handler' );
const jwt = require( 'jsonwebtoken' );
const bcrypt = require( 'bcryptjs' );
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
        console.log( token );
    }

    if ( !token ) {
        return next( new ApiError( `Not authorized to access this route`, 401 ) );
    }

    // 2) Verify token ( no changes happen , expiration time )
    const decoded = jwt.verify( token, process.env.JWT_SECRET_KEY );
    console.log( decoded );
    // 3) Check if user still exists

    const user = await User.findById( decoded.userId );
    if ( !user ) {
        return next( new ApiError( `The user belonging to this token does no longer exist`, 401 ) );
    }

    // 4) Check if user changed password after the token was craeted
    next();
} );

