const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

const {
  addProductToWishlistValidator,
  removeProductToWishlistValidator,
} = require( "../utils/validators/wishlistValidators" )

const {
  addProductToWishList,
  getWishList,
  removeProductToWishList,
} = require( "../services/wishlistService" );

const router = express.Router();

router
  .route( "/" )
  .post(
    protect,
    allowTo( "user" ),
    addProductToWishlistValidator,
    addProductToWishList,
  )
  .get(
    protect,
    allowTo( "user" ),
    getWishList
  );

router.delete(
  "/:productId",
  protect,
  allowTo( "user" ),
  removeProductToWishlistValidator,
  removeProductToWishList,
);

module.exports = router;
