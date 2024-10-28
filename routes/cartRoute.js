const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

const {
  addProductToCartValidator,
  updateCartItemValidator,
  removeCartItemValidator,
  applyCouponValidator,
} = require( "../utils/validators/cartValidators" )

const {
  getCart,
  addProductToCart,
  applyCoupon,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require( "../services/cartService" );

const router = express.Router();

router.use( protect, allowTo( "user" ) );

router
  .route( "/" )
  .get( getCart )
  .post(
    addProductToCartValidator,
    addProductToCart,
  )
  .delete( clearCart );

router.route( "/applyCoupon" )
  .post(
    applyCouponValidator,
    applyCoupon,
  );

router
  .route( "/:cartItemId" )
  .put(
    updateCartItemValidator,
    updateCartItem,
  )
  .delete(
    removeCartItemValidator,
    removeCartItem,
  );


module.exports = router;
