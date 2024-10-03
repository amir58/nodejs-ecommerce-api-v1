const asyncHandler = require( "express-async-handler" );
const sharp = require( "sharp" );
const { v4: uuid } = require( "uuid" );
const { uploadSingleImage } = require( "../middlewares/uploadImageMiddleware" );
const Category = require( "../models/categoryModel" );
const factory = require( "./handlersFactory" );



exports.uploadCategoryImage = uploadSingleImage( "image" )


exports.resizeImage = asyncHandler( async ( req, res, next ) => {
    const fileName = `category-${ uuid() }-${ Date.now() }.jpeg`
    await sharp( req.file.buffer )
        .resize( 600, 600 )
        .toFormat( "jpeg" )
        .jpeg( { quality: 90 } )
        .toFile( `uploads/categories/${ fileName }` );
    req.body.image = fileName;
    next();
} )

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = factory.createOne( Category );


// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = factory.getAll( Category )

// @desc    Get specific category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne( Category );

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne( Category );

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne( Category );
