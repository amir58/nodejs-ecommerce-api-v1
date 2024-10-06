const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

const {
    createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
} = require( "../utils/validators/subCategoryValidators" );

const {
    setCategoryIdToBody,
    createSubCategory,
    createFilterObject,
    getSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
} = require( "../services/subCategoryService" );

const router = express.Router( { mergeParams: true } );

router
    .route( "/" )
    .post(
        protect,
        allowTo( "admin", "manager" ),
        setCategoryIdToBody,
        createSubCategoryValidator,
        createSubCategory,
    )
    .get( createFilterObject, getSubCategories );

router
    .route( "/:id" )
    .get( getSubCategoryValidator, getSubCategory )
    .put(
        protect,
        allowTo( "admin", "manager" ),
        updateSubCategoryValidator,
        updateSubCategory,
    )
    .delete(
        protect,
        allowTo( "admin" ),
        deleteSubCategoryValidator,
        deleteSubCategory,
    );



module.exports = router;
