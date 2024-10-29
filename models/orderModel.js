const mongoose = require( 'mongoose' );

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [ true, "Order must belong to a user" ],
        },
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Product',
                },
                quantity: Number,
                color: String,
                price: Number,
            },
        ],
        shippingAddress: {
            details: {
                type: String,
                default: "",
            },
            phone: {
                type: String,
                default: "",
            },
            city: {
                type: String,
                default: "",
            },
            postalCode: {
                type: String,
                default: "",
            },
        },
        taxPrice: {
            type: Number,
            default: 0,
        },
        paymentMethodType: {
            type: String,
            enum: [ 'card', 'cash' ],
            default: 'cash',
        },
        shippingPrice: {
            type: Number,
            default: 0,
        },
        totalPrice: {
            type: Number,
            default: 0,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: {
            type: Date,
            default: "",
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: {
            type: Date,
            default: "",
        },
    },
    { timestamps: true }
);

orderSchema.pre( /^find/, function ( next ) {
    this.populate( {
        path: "user",
        select: "name email phone",
    } )
        .populate( {
            path: "cartItems.product",
            select: "title imageCover",
        } )
    next();
} );

const orderModel = mongoose.model( "Order", orderSchema );

module.exports = orderModel;