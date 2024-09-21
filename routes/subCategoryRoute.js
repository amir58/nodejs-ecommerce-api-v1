const express = require( "express" );

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
    .post( setCategoryIdToBody, createSubCategoryValidator, createSubCategory )
    .get( createFilterObject, getSubCategories );

router
    .route( "/:id" )
    .get( getSubCategoryValidator, getSubCategory )
    .put( updateSubCategoryValidator, updateSubCategory )
    .delete( deleteSubCategoryValidator, deleteSubCategory );



module.exports = router;
