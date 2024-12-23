const bcrypt = require( 'bcryptjs' );
const mongoose = require( 'mongoose' );

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [ true, 'name required' ],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        email: {
            type: String,
            required: [ true, 'email required' ],
            unique: true,
            lowercase: true,
        },
        phone: String,
        profileImage: String,
        password: {
            type: String,
            required: [ true, 'password required' ],
            minlength: [ 6, 'Too short password' ],
        },
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetExpires: Date,
        passwordResetVerified: Boolean,
        role: {
            type: String,
            enum: [ 'user', 'manager', 'admin' ],
            default: 'user',
        },
        active: {
            type: Boolean,
            default: true,
        },
        // Child refrence ( One To Many )
        wishlist: [ {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
        } ],
        addresses: [ {
            id: { type: mongoose.Schema.ObjectId },
            alias: String,
            details: String,
            phone: String,
            postalCode: String,
        } ],
    },
    { timestamps: true }
);

userSchema.pre( 'save', async function ( next ) {
    if ( !this.isModified( 'password' ) ) {
        return next();
    }

    this.password = await bcrypt.hashSync( this.password, 12 );
    next();
} );

const User = mongoose.model( 'User', userSchema );

module.exports = User;