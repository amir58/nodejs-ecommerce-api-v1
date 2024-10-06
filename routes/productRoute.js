const express = require( "express" );

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

router
  .route( "/" )
  .get( getProducts )
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
  .get( getProductValidator, getProduct )
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
