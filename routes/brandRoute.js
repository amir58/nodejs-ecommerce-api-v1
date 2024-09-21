const express = require( "express" );

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
} = require( "../services/brandService" );

const router = express.Router();

router
  .route( "/" )
  .get( getBrands )
  .post( createBrandValidator, createBrand );

router
  .route( "/:id" )
  .get( getBrandValidator, getBrand )
  .put( updateBrandValidator, updateBrand )
  .delete( deleteBrandValidator, deleteBrand );

// router.post("/", createBrand);
// router.get("/", getBrands);

module.exports = router;
