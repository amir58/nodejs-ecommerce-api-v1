const asyncHandler = require( "express-async-handler" );
const sharp = require( "sharp" );
const { v4: uuid } = require( "uuid" );
const { uploadMixOfImages } = require( "../middlewares/uploadImageMiddleware" );
const ApiError = require( "../utils/apiError" );
const Product = require( "../models/productModel" );
const ApiFetaures = require( "../utils/apiFeatures" );
const factory = require( "./handlersFactory" );
const User = require( "../models/userModel" );

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
// exports.getProducts = factory.getAll( Product, 'products' );

exports.getProducts = asyncHandler( async ( req, res ) => {
    let filter = {};
    console.log( req.filterObject );
    if ( req.filterObject ) {
        filter = req.filterObject;
    }

    const countDocuments = await Product.countDocuments();

    const apiFeatures = new ApiFetaures( Product.find( filter ), req.query );

    apiFeatures
        .paginate( countDocuments )
        .filter()
        .sort()
        .limitFields()
        .search( 'products' );

    const { mongooseQuery, pagingResults } = apiFeatures;
    const documents = await mongooseQuery;

    if ( req.user ) {
        const user = await User.findById( req.user._id );

        documents.forEach( document => {
            if ( user.wishlist.includes( document._id ) ) {
                document.isFavourite = true;
            }
        } );
    }

    res.status( 200 ).json( {
        results: documents.length,
        pagingResults,
        data: documents,
    } );
} );

// @desc    Get specific Product
// @route   GET /api/v1/products/:id
// @access  Public
// exports.getProduct = factory.getOne( Product, 'reviews' );

exports.getProduct = asyncHandler( async ( req, res, next ) => {

    // 1) Build query
    let query = Product.findById( req.params.id );
    query = query.populate( "reviews" );


    // 2) Execute query
    const document = await query;

    if ( !document ) {
        return next( new ApiError( `document not found`, 404 ) );
    }

    if ( req.user ) {
        const user = await User.findById( req.user._id );

        if ( user.wishlist.includes( document._id ) ) {
            document.isFavourite = true;
        }
    }


    res.status( 200 ).json( { data: document } );
} );

// @desc    Update Product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne( Product );
// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne( Product );

