const mongoose = require( "mongoose" );

// 1 - Create schema
const cartSchema = new mongoose.Schema(
  {
    totalPrice: Number,
    totlaPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [ true, "User required" ],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
          min: [ 1, "Quantity must be at least 1" ],
        },

        price: Number,
        color: String,
      }
    ]
  },
  { timestamps: true }
);

// 2 - Create model
const cartModel = mongoose.model( "Cart", cartSchema );

module.exports = cartModel;
