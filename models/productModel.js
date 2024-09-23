const mongoose = require( "mongoose" );

// 1 - Create schema
const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [ true, "Product required" ],
            unique: [ true, "Product must be unique" ],
            minLength: [ 3, "Too short Product name" ],
            maxLength: [ 64, "Too long Product name" ],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        description: {
            type: String,
            required: [ true, "Description required" ],
            minLength: [ 20, "Too short description" ],
            maxLength: [ 600, "Too long description" ],
        },
        quantity: {
            type: Number,
            required: [ true, "Quiantity required" ],
            // min: [ 1, "Quiantity must be more than 0" ],
        },
        sold: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [ true, "Price required" ],
            trim: true,
            min: [ 1, "Price must be more than 0" ],
            max: [ 200000, "Price must be more than 0" ],
        },
        priceAfterDiscount: {
            type: Number,

        },
        colors: [ String ],
        imageCover: {
            type: String,
            required: [ true, "Image cover required" ],
        },
        images: [ String ],
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: [ true, "Product must belong to a category" ],
        },
        subCategories: [ {
            type: mongoose.Schema.ObjectId,
            ref: "SubCategory",
            // required: [ true, "Product must belong to a subcategory" ],
        } ],
        brand: {
            type: mongoose.Schema.ObjectId,
            ref: "Brand",
            // required: [ true, "Product must belong to a brand" ],
        },
        ratingAverages: {
            type: Number,
            min: [ 0, "Rating must be more than 0" ],
            max: [ 5, "Rating must be less than or equal to 5" ],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
            min: [ 0, "Quantity must be more than 0" ],
        },
    },
    { timestamps: true }
);

// 2 - Create model
const productModel = mongoose.model( "Product", productSchema );

module.exports = productModel;
