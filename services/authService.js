const asyncHandler = require( 'express-async-handler' );
const jwt = require( 'jsonwebtoken' );
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
        { id: document._id },
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
