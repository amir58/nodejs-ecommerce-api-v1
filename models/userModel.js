const bcrypt = require( 'bcrypt' );
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
        role: {
            type: String,
            enum: [ 'user', 'manager', 'admin' ],
            default: 'user',
        },
        active: {
            type: Boolean,
            default: true,
        },
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