const mongoose = require( "mongoose" );

// 1 - Create schema
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [ true, "Coupon required" ],
      unique: [ true, "Coupon must be unique" ],
      minLength: [ 2, "Too short Coupon name" ],
      maxLength: [ 16, "Too long Coupon name" ],
    },
    expire: {
      type: Date,
      required: [ true, "Expire required" ],
    },
    discount: {
      type: Number,
      required: [ true, "Discount required" ],
      minLength: [ 1, "Discount must be at least 1 digit" ],
      maxLength: [ 3, "Discount must be at most 3 digits" ],
      min: [ 1, "Discount must be at least 1" ],
      max: [ 100, "Discount must be at most 100" ],
    },
  },
  { timestamps: true }
);

// 2 - Create model
const couponModel = mongoose.model( "Coupon", couponSchema );

module.exports = couponModel;
