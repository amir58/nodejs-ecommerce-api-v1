const asyncHandler = require( "express-async-handler" );
const sharp = require( "sharp" );
const { v4: uuid } = require( "uuid" );
const { uploadMixOfImages } = require( "../middlewares/uploadImageMiddleware" );
const Product = require( "../models/productModel" );
const factory = require( "./handlersFactory" );

exports.uploadImages = uploadMixOfImages( [
    {
        name: 'imageCover',
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 5,
    },
] );

exports.resizeImages = asyncHandler( async ( req, res, next ) => {

    if ( req.files.images ) {
        const fileName = `product-cover-${ uuid() }-${ Date.now() }.jpeg`
        await sharp( req.files.imageCover[ 0 ].buffer )
            // .resize( 3000, 1200 )
            .toFormat( "jpeg" )
            .jpeg( { quality: 95 } )
            .toFile( `uploads/products/${ fileName }` );
        req.body.imageCover = fileName;
    }

    if ( req.files.images ) {
        req.body.images = [];

        await Promise.all(
            req.files.images.map( async ( file, index ) => {
                const fileName = `product${ index }-${ uuid() }-${ Date.now() }.jpeg`;
                await sharp( file.buffer )
                    // .resize( 3000, 1200 )
                    .toFormat( "jpeg" )
                    .jpeg( { quality: 95 } )
                    .toFile( `uploads/products/${ fileName }` );

                req.body.images.push( fileName );
            }
            ) );

    }

    console.log( req.body.imageCover );
    console.log( req.body.images );

    next();
} )


// @desc    Create Product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = factory.createOne( Product );


// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll( Product, 'products' );

// @desc    Get specific Product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne( Product );
// @desc    Update Product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne( Product );
// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne( Product );

