const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

const {
  getCartValidator,
  createCartValidator,
  updateCartValidator,
  deleteCartValidator,
} = require( "../utils/validators/brandValidators" )

const {
  getCarts,
  getCart,
  addProductToCart,
  updateCart,
  deleteCart,
} = require( "../services/cartService" );

const router = express.Router();

router.use( protect, allowTo( "user" ) );

router
  .route( "/" )
  .get( getCart )
  .post(
    // createCartValidator,
    addProductToCart,
  );

// router
//   .route( "/:id" )
//   .get( getCartValidator, getCart )
//   .put(
//     protect,
//     allowTo( "admin", "manager" ),
//     updateCartValidator,
//     updateCart,
//   )
//   .delete(
//     protect,
//     allowTo( "admin" ),
//     deleteCartValidator,
//     deleteCart,
//   );


module.exports = router;
