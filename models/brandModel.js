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

const setImageURL = ( doc ) => {
  if ( doc.image ) {
    const imageUrl = `${ process.env.BASE_URL }/brands/${ doc.image }`;
    doc.image = imageUrl;
  }
}

brandSchema.post( 'init', ( doc ) => { setImageURL( doc ) } );
brandSchema.post( 'save', ( doc ) => { setImageURL( doc ) } );

// 2 - Create model
const brandModel = mongoose.model( "Brand", brandSchema );

module.exports = brandModel;
