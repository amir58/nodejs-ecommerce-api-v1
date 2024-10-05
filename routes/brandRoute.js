const express = require( "express" );

const { protect } = require( "../services/authService" );

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require( "../utils/validators/brandValidators" )

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require( "../services/brandService" );

const router = express.Router();

router
  .route( "/" )
  .get( getBrands )
  .post(
    protect,
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand,
  );

router
  .route( "/:id" )
  .get( getBrandValidator, getBrand )
  .put(
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand,
  )
  .delete( deleteBrandValidator, deleteBrand );

// router.post("/", createBrand);
// router.get("/", getBrands);

module.exports = router;
