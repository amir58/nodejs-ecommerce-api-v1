const mongose = require( "mongoose" );

const subCategorySchema = new mongose.Schema( {
    "name": {
        type: String,
        trim: true,
        unique: [ true, 'subCategory must be unique' ],
        minLength: [ 2, 'Too short subCategory name' ],
        maxLength: [ 32, 'Too long subCategory name' ],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    "category": {
        type: mongose.Schema.ObjectId,
        ref: 'Category',
        required: [ true, 'SubCategory must belong to a category' ]
    },



},
    { timestamps: true }
);

const subCategoryModel = mongose.model( "SubCategory", subCategorySchema );

module.exports = subCategoryModel; 