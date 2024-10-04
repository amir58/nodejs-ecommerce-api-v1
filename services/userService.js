const asyncHandler = require( 'express-async-handler' );
const { v4: uuidv4 } = require( 'uuid' );
const sharp = require( 'sharp' );
const bcrypt = require( 'bcryptjs' );
const ApiError = require( '../utils/apiError' )
const factory = require( './handlersFactory' );
const { uploadSingleImage } = require( '../middlewares/uploadImageMiddleware' );
const User = require( '../models/userModel' );

// Upload single image
exports.uploadUserImage = uploadSingleImage( 'profileImage' );

// Image processing
exports.resizeImage = asyncHandler( async ( req, res, next ) => {
    const filename = `user-${ uuidv4() }-${ Date.now() }.jpeg`;

    if ( req.file ) {
        await sharp( req.file.buffer )
            .resize( 600, 600 )
            .toFormat( 'jpeg' )
            .jpeg( { quality: 95 } )
            .toFile( `uploads/users/${ filename }` );

        // Save image into our db
        req.body.profileImage = filename;
    }

    next();
} );

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = factory.getAll( User );

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = factory.getOne( User );

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private/Admin
exports.createUser = factory.createOne( User );

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/User
exports.updateUser = asyncHandler( async ( req, res, next ) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            profileImg: req.body.profileImg,
            role: req.body.role
        },
        { new: true }
    );

    if ( !document ) {
        // res.status(404).json({ msg: `document not found` });
        return next( new ApiError( `document not found`, 404 ) );
    }

    res.status( 200 ).json( { data: document } );
} );

// @desc    Update user password
// @route   PUT /api/v1/users/:id
// @access  Private/User
exports.changeUserPassword = asyncHandler( async ( req, res, next ) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash( req.body.password, 12 )
        },
        { new: true }
    );

    if ( !document ) {
        // res.status(404).json({ msg: `document not found` });
        return next( new ApiError( `document not found`, 404 ) );
    }

    res.status( 200 ).json( { data: document } );
} );

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler( async ( req, res, next ) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        { active: false },
        { new: true }
    );

    if ( !document ) {
        // res.status(404).json({ msg: `document not found` });
        return next( new ApiError( `document not found`, 404 ) );
    }

    res.status( 200 ).json( { data: document } );
} );
