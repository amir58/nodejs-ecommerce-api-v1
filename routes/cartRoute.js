const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

const {
  getCartValidator,
  createCartValidator,
  updateCartValidator,
  deleteCartValidator,
} = require( "../utils/validators/brandValidators" )

const {
  getCart,
  addProductToCart,
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
    // createCartValidator,
    addProductToCart,
  )
  .delete( clearCart );

router
  .route( "/:cartItemId" )
  .put(
    //     updateCartValidator,
    updateCartItem,
  )
  .delete(
    //     deleteCartValidator,
    removeCartItem,
  );


module.exports = router;
