const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

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
    allowTo( "admin", "manager" ),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand,
  );

router
  .route( "/:id" )
  .get( getBrandValidator, getBrand )
  .put(
    protect,
    allowTo( "admin", "manager" ),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand,
  )
  .delete(
    protect,
    allowTo( "admin" ),
    deleteBrandValidator,
    deleteBrand,
  );

// router.post("/", createBrand);
// router.get("/", getBrands);

module.exports = router;
