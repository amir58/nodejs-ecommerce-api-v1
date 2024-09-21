const mongoose = require( "mongoose" );

// 1 - Create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [ true, "Brand required" ],
      unique: [ true, "Brand must be unique" ],
      minLength: [ 3, "Too short Brand name" ],
      maxLength: [ 32, "Too long Brand name" ],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// 2 - Create model
const brandModel = mongoose.model( "Brand", brandSchema );

module.exports = brandModel;
