
const { check, body } = require( 'express-validator' );
const slugify = require( "slugify" );
const validatorMiddleware = require( '../../middlewares/validatorMiddleware' );

const Category = require( '../../models/categoryModel' );
const SubCategory = require( '../../models/subCategoryModel' );
const Brand = require( '../../models/brandModel' );

exports.getProductValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid Product id' ),
    validatorMiddleware,
];

exports.createProductValidator = [
    check( 'title' )
        .notEmpty()
        .withMessage( 'Product name is required' )
        .isLength( { min: 3, } )
        .withMessage( 'Too short Product name' )
        .isLength( { max: 64 } )
        .withMessage( 'Too long Product name' )
        .custom( ( value, { req } ) => {
            req.body.slug = slugify( value );
            return true;
        } ),

    check( 'description' )
        .notEmpty()
        .withMessage( 'Product description is required' )
        .isLength( { min: 20, } )
        .withMessage( 'Too short Product description' )
        .isLength( { max: 600 } )
        .withMessage( 'Too long Product description' ),

    check( 'quantity' )
        .notEmpty()
        .withMessage( 'Product quantity is required' )
        .isNumeric()
        .withMessage( 'Product quantity must be a number' ),

    check( 'price' )
        .notEmpty()
        .withMessage( 'Product price is required' )
        .isNumeric()
        .withMessage( 'Product price must be a number' )
        .isLength( { max: 32 } )
        .withMessage( 'Too long Product price' ),

    check( 'priceAfterDiscount' )
        .optional()
        .toFloat()
        .isNumeric()
        .withMessage( 'Product price after discount must be a number' )
        .isLength( { max: 32 } )
        .withMessage( 'Too long Product price' )
        .custom( ( value, { req, } ) => {
            if ( req.body.price <= value ) {
                throw new Error( 'Product price after discount must be less than or equal to Product price' );
            }
            return true;
        } )
    ,

    check( 'colors' )
        .optional()
        .isArray()
        .withMessage( 'Product colors must be an array' ),

    check( 'imageCover' )
        .notEmpty()
        .withMessage( 'Product image cover is required' ),

    check( 'images' )
        .optional()
        .isArray()
        .withMessage( 'Product images must be an array' ),

    check( 'category' )
        .notEmpty()
        .withMessage( 'Product category is required' )
        .isMongoId()
        .withMessage( 'Invalid category id' )
        .custom( ( categoryId ) =>
            Category.findById( categoryId ).then(
                ( category ) => {
                    if ( !category ) {
                        return Promise.reject( new Error( `No category found with this id ${ categoryId }` ) );
                    }
                } ) ),

    check( 'subCategories' )
        .optional()
        // .toArray()
        // .withMessage( 'Product subCategories must be an array' )
        .isMongoId()
        .withMessage( 'Invalid subCategory id' )
        .custom( ( subCategoriesIds ) =>
            SubCategory.find( { _id: { $exists: true, $in: subCategoriesIds } } )
                .then( ( result ) => {

                    if (
                        // result.length < 1 ||
                        result.length !== subCategoriesIds.length
                    ) {
                        return Promise.reject( new Error( 'Some subCategories does not exist' ) );
                    }
                    return true;
                } ) )
        .custom( ( subCategoriesIds, { req } ) =>
            SubCategory.find( { category: req.body.category } ).then( ( subCategories ) => {

                const subCategoriesIdsInDB = [];
                subCategories.forEach( ( subCategory ) => {
                    subCategoriesIdsInDB.push( subCategory._id.toString() );
                } );

                console.log( subCategoriesIdsInDB );

                const valid = subCategoriesIds.every( id => subCategoriesIdsInDB.includes( id ) );
                console.log( valid );

                if ( !valid ) {
                    return Promise.reject( new Error( 'Some subCategories does not belong to this category' ) );
                }
                console.log( 'true' );
                return true;
            } )
        )
    ,

    check( 'brand' )
        .optional()
        .isMongoId()
        .withMessage( 'Invalid brand id' )
        .custom( ( brandId ) => Brand.findById( brandId ).then( brand => {
            if ( !brand ) {
                return Promise.reject( new Error( `No brand found with this id ${ brandId }` ) );
            }
        } ) ),

    check( 'ratingsAverage' )
        .optional()
        .isNumeric()
        .withMessage( 'Product ratings average must be a number' )
        .isLength( { min: 1 } )
        .withMessage( 'Product ratings averag must be more than 0' )
        .isLength( { max: 5 } )
        .withMessage( 'Product ratings averag must be less than or equal to 5' )
    ,

    check( 'ratingsQuantity' )
        .optional()
        .isNumeric()
        .withMessage( 'Product ratings quantity must be a number' ),

    validatorMiddleware,
];

exports.updateProductValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid Product id' ),
    body( 'title' )
        .optional()
        .custom( ( value, { req } ) => {
            req.body.slug = slugify( value );
            return true;
        } ),
    validatorMiddleware,
];

exports.deleteProductValidator = [
    check( 'id' ).isMongoId().withMessage( 'Invalid Product id' ),
    validatorMiddleware,
];
