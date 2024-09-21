const express = require( "express" );

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require( "../utils/validators/categoryValidators" )

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require( "../services/categoryService" );

const subCategoryRoute = require( "./subCategoryRoute" );

const router = express.Router();

router.use( "/:categoryId/subCategories", subCategoryRoute );

router
  .route( "/" )
  .get( getCategories )
  .post( createCategoryValidator, createCategory );

router
  .route( "/:id" )
  .get( getCategoryValidator, getCategory )
  .put( updateCategoryValidator, updateCategory )
  .delete( deleteCategoryValidator, deleteCategory );

// router.post("/", createCategory);
// router.get("/", getCategories);

module.exports = router;
