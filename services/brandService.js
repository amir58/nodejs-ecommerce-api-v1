const asyncHandler = require( "express-async-handler" );
const sharp = require( "sharp" );
const { v4: uuid } = require( "uuid" );
const { uploadSingleImage } = require( "../middlewares/uploadImageMiddleware" );
const Brand = require( "../models/brandModel" );
const factory = require( "./handlersFactory" );

exports.uploadBrandImage = uploadSingleImage( "image" )


exports.resizeImage = asyncHandler( async ( req, res, next ) => {
    const fileName = `brand-${ uuid() }-${ Date.now() }.jpeg`
    await sharp( req.file.buffer )
        .resize( 600, 600 )
        .toFormat( "jpeg" )
        .jpeg( { quality: 90 } )
        .toFile( `uploads/brands/${ fileName }` );
    req.body.image = fileName;
    next();
} )

// @desc    Create Brand
// @route   POST /api/v1/brands
// @access  Private
exports.createBrand = factory.createOne( Brand );

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = factory.getAll( Brand );

// @desc    Get specific Brand
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = factory.getOne( Brand );
// @desc    Update Brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne( Brand );

// @desc    Delete Brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne( Brand );

