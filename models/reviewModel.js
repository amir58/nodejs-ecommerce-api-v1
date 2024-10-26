const mongoose = require( "mongoose" );
const Product = require( "./productModel" );

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
        // Parent refrence ( One To Many )
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

function round( num, decimals ) {
    const n = 10 ** decimals;
    return Math.round( ( n * num ).toFixed( decimals ) ) / n;
};

reviewSchema.statics.calculateRatingsAverageAndRatingsQuantity = async function ( productId ) {
    const result = await this.aggregate(
        [
            // Stage 1 : Get all reviews about specific product
            {
                $match: { product: productId },
            },
            // Stage 2 : Grouping reviews based on productId and calculate average and quantity
            {
                $group: {
                    _id: '$product',
                    ratingsAverage: { $avg: '$rating' },
                    ratingsQuantity: { $sum: 1 },
                },
            },
        ]
    );

    console.log( result );

    if ( result.length > 0 ) {
        await Product.findByIdAndUpdate(
            result[ 0 ]._id,
            {
                ratingsAverage: round( result[ 0 ].ratingsAverage, 2 ),
                ratingsQuantity: result[ 0 ].ratingsQuantity,
            }
        );
    }
    else {
        await Product.findByIdAndUpdate( this.product, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        } );
    }
};

reviewSchema.post( "save", async function () {
    await this.constructor.calculateRatingsAverageAndRatingsQuantity( this.product );
} );

reviewSchema.post( "deleteOne", async function ( document ) {
    console.log( 'deleteOne' );
    console.log( document );
    console.log( this.product );
    // await this.constructor.calculateRatingsAverageAndRatingsQuantity( this.product );
} );



const reviewModel = mongoose.model( "Review", reviewSchema );

module.exports = reviewModel;