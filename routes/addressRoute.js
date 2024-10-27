const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

const {
  addAddressValidator,
  removeAddressValidator,
} = require( "../utils/validators/addressValidators" )

const {
  addAddress,
  getLoggedUserAddresses,
  removeAddress,
} = require( "../services/addressService" );

const router = express.Router();

router.use( protect, allowTo( "user" ) );

router
  .route( "/" )
  .post(
    addAddressValidator,
    addAddress,
  )
  .get( getLoggedUserAddresses );

router.delete(
  "/:addressId",
  removeAddressValidator,
  removeAddress,
);

module.exports = router;
