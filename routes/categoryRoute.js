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
  uploadCategoryImage,
  resizeImage,
} = require( "../services/categoryService" );

const subCategoryRoute = require( "./subCategoryRoute" );

const router = express.Router();

router.use( "/:categoryId/subCategories", subCategoryRoute );

router
  .route( "/" )
  .get( getCategories )
  .post(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory,
  );

router
  .route( "/:id" )
  .get( getCategoryValidator, getCategory )
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory,
  )
  .delete( deleteCategoryValidator, deleteCategory );

// router.post("/", createCategory);
// router.get("/", getCategories);

module.exports = router;
