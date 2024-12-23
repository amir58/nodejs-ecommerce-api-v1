const mongoose = require( "mongoose" );

// 1 - Create schema
const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [ true, "Product required" ],
            unique: [ true, "Product must be unique" ],
            minLength: [ 3, "Too short Product name" ],
            maxLength: [ 128, "Too long Product name" ],
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
        ratingsAverage: {
            type: Number,
            min: [ 0, "Rating must be more than 0" ],
            max: [ 5, "Rating must be less than or equal to 5" ],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
            min: [ 0, "Quantity must be more than 0" ],
        },
        isFavourite: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

productSchema.virtual( 'reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
} );


productSchema.pre( /^find/, function ( next ) {
    this.populate( {
        path: "category",
        select: "name",
    } )
    next();
} );

const setImageURL = ( doc ) => {
    if ( doc.imageCover ) {
        const imageUrl = `${ process.env.BASE_URL }/products/${ doc.imageCover }`;
        doc.imageCover = imageUrl;
    }

    if ( doc.images ) {
        // eslint-disable-next-line array-callback-return
        doc.images.map( ( image, index ) => {
            const imageUrl = `${ process.env.BASE_URL }/products/${ doc.images[ index ] }`;
            doc.images[ index ] = imageUrl;
        } );
    }
}


productSchema.post( 'init', ( doc ) => {
    setImageURL( doc )
} );
productSchema.post( 'save', ( doc ) => {
    setImageURL( doc )
} );




// 2 - Create model
const productModel = mongoose.model( "Product", productSchema );

module.exports = productModel;
