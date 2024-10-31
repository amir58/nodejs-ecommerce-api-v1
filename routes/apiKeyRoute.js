const express = require( "express" );
const { protect, allowTo } = require( "../services/authService" );
const {
    getApiKeys,
    getApiKey,
    createApiKey,
    updateApiKey,
    deleteApiKey
} = require( "../services/apiKeyService" );

const router = express.Router();

router.use( protect, allowTo( "admin" ) );

router
    .route( "/" )
    .get( getApiKeys )
    .post( createApiKey );

router
    .route( "/:id" )
    .get( getApiKey )
    .put( updateApiKey )
    .delete( deleteApiKey );

module.exports = router;
