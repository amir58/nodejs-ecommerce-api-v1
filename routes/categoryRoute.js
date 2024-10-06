const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

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
    protect,
    allowTo( "admin", "manager" ),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory,
  );

router
  .route( "/:id" )
  .get( getCategoryValidator, getCategory )
  .put(
    protect,
    allowTo( "admin", "manager" ),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory,
  )
  .delete(
    protect,
    allowTo( "admin", ),
    deleteCategoryValidator, deleteCategory );

// router.post("/", createCategory);
// router.get("/", getCategories);

module.exports = router;
