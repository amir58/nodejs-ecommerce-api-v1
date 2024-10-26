const express = require( "express" );
const reviewRoute = require( "./reviewRoute" );

const { protect, allowTo } = require( "../services/authService" );

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require( "../utils/validators/productValidators" )

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  resizeImages,
} = require( "../services/productService" );

const router = express.Router();

// Nested Route
// GET /products/:productId/reviews
router.use( "/:productId/reviews", reviewRoute );


router
  .route( "/" )
  .get( protect, getProducts )
  .post(
    protect,
    allowTo( "admin", "manager" ),
    uploadImages,
    resizeImages,
    createProductValidator,
    createProduct,
  );

router
  .route( "/:id" )
  .get( protect, getProductValidator, getProduct )
  .put(
    protect,
    allowTo( "admin", "manager" ),
    uploadImages,
    resizeImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(
    protect,
    allowTo( "admin" ),
    deleteProductValidator,
    deleteProduct,
  );

module.exports = router;
