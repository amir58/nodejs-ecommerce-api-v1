const multer = require( "multer" );
const sharp = require( "sharp" );
const { v4: uuid } = require( "uuid" );
const asyncHandler = require( "express-async-handler" );
const Category = require( "../models/categoryModel" );
const factory = require( "./handlersFactory" );

// const multerStorage = multer.diskStorage( {
//     destination: ( req, file, cb ) => {
//         cb( null, "uploads/categories" );
//     },
//     filename: ( req, file, cb ) => {
//         const ext = file.mimetype.split( "/" )[ 1 ];
//         cb( null, `category-${ uuid() }-${ Date.now() }.${ ext }` );
//     },
// } );

const multerStorage = multer.memoryStorage();

const multerFilter = function ( req, file, cb ) {
    if ( file.mimetype.startsWith( "image" ) ) {
        cb( null, true );
    } else {
        cb( new Error( "Only images allowed." ), false );
    }
};

const upload = multer( {
    storage: multerStorage,
    fileFilter: multerFilter,
} );


exports.uploadCategoryImage = upload.single( "image" );


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
