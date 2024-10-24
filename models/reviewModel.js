const mongoose = require( "mongoose" );

// 1 - Create schema
const reviewSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            // required: [ true, "Review must have a comment" ],
        },
        rating: {
            type: Number,
            min: [ 1, "Rating must be at least 1" ],
            max: [ 5, "Rating must be at most 5" ],
            required: [ true, "Review must have a rating" ],
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: [ true, "Review must belong to a product" ],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [ true, "Review must belong to a user" ],
        },
    },
    { timestamps: true }
);

reviewSchema.pre( /^find/, function ( next ) {
    this.populate( { path: 'user', select: 'name' } );
    next();
} );


const reviewModel = mongoose.model( "Review", reviewSchema );

module.exports = reviewModel;