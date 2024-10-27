const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

const {
  addAddressValidator,
  updateAddressValidator,
  removeAddressValidator,
} = require( "../utils/validators/addressValidators" )

const {
  addAddress,
  getLoggedUserAddresses,
  updateAddress,
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

router
  .route( "/:addressId" )
  .put(
    updateAddressValidator,
    updateAddress,
  )
  .delete(
    removeAddressValidator,
    removeAddress,
  );

module.exports = router;
