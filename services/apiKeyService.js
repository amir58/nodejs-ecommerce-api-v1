const asyncHandler = require( "express-async-handler" );
const crypto = require( "crypto-js" );

const ApiKey = require( "../models/apiKeyModel" );
const ApiError = require( "../utils/apiError" );
const factory = require( "./handlersFactory" );

// Get list of API keys
exports.getApiKeys = factory.getAll( ApiKey );

// Get specific API key
exports.getApiKey = factory.getOne( ApiKey );

// Create API key
exports.createApiKey = asyncHandler( async ( req, res, next ) => {
    req.body.key = crypto.lib.WordArray.random( 32 ).toString();
    const apiKey = await ApiKey.create( req.body );
    res.status( 201 ).json( { data: apiKey } );
} );

// Update API key
exports.updateApiKey = factory.updateOne( ApiKey );

// Delete API key
exports.deleteApiKey = factory.deleteOne( ApiKey );

// Validate API key
exports.validateApiKey = asyncHandler( async ( req, res, next ) => {
    const xApiKey = req.headers[ "api-key" ];
    console.log( xApiKey );

    if ( !xApiKey ) {
        return next( new ApiError( "API key is missing, please provide your API key in the header `api-key`", 401 ) );
    }

    const apiKey = await ApiKey.findOne( { key: xApiKey, isActive: true } );
    if ( !apiKey ) {
        return next( new ApiError( "Invalid API key", 401 ) );
    }

    // Update last used timestamp
    apiKey.lastUsed = new Date();
    await apiKey.save();

    next();
} );
