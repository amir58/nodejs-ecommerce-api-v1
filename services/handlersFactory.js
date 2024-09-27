// const slugify = require( "slugify" );
const asyncHandler = require( "express-async-handler" );
const ApiError = require( "../utils/apiError" );
// const ApiFetaures = require( "../utils/apiFeatures" );


exports.deleteOne = ( Model ) => asyncHandler( async ( req, res, next ) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete( id );
    if ( !document ) {
        // res.status(404).json({ msg: `document not found` });
        return next( new ApiError( `document not found`, 404 ) );
    }

    res.status( 200 ).json( { msg: `document deleted` } );
} );

exports.updateOne = ( Model ) => asyncHandler( async ( req, res, next ) => {
    const document = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if ( !document ) {
        // res.status(404).json({ msg: `document not found` });
        return next( new ApiError( `document not found`, 404 ) );
    }

    res.status( 200 ).json( { data: document } );
} );
