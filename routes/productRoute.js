const express = require( "express" );

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
    uploadImages,
    resizeImages,
    createProductValidator,
    createProduct,
  );

router
  .route( "/:id" )
  .get( getProductValidator, getProduct )
  .put(
    uploadImages,
    resizeImages,
    updateProductValidator,
    updateProduct,
  )
  .delete( deleteProductValidator, deleteProduct );

module.exports = router;
