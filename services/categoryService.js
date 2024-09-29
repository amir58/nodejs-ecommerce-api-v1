const multer = require( "multer" );
const { v4: uuid } = require( "uuid" );
const Category = require( "../models/categoryModel" );
const factory = require( "./handlersFactory" );

const multerStorage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        cb( null, "uploads/categories" );
    },
    filename: ( req, file, cb ) => {
        const ext = file.mimetype.split( "/" )[ 1 ];
        cb( null, `category-${ uuid() }-${ Date.now() }.${ ext }` );
    },
} );

const upload = multer( { storage: multerStorage } );

exports.uploadCategoryImage = upload.single( "image" );

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
