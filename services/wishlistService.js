const asyncHandler = require( 'express-async-handler' );

const User = require( '../models/userModel' );


// @desc    Add product to wishlist
// @route   POST  /api/v1/wishlist
// @access  Protected/User
exports.addProductToWishList = asyncHandler( async ( req, res, next ) => {
    const user = await User.findByIdAndUpdate( req.user._id,
        {
            // Set wishlist as an array
            // Set don't allow duplicate values
            $addToSet: {
                wishlist: req.body.productId,
            },
        },
        {
            new: true
        }
    );

    res.status( 200 ).json( {
        status: 'success',
        message: 'Product added to wishlist successfully',
        data: user.wishlist,
    } );
}
);

// @desc    Get wishlist
// @route   GET  /api/v1/wishlist
// @access  Protected/User
exports.getWishList = asyncHandler( async ( req, res, next ) => {
    const user = await User.findById( req.user._id ).populate( 'wishlist' );

    console.log( user );

    res.status( 200 ).json( {
        status: 'success',
        data: user.wishlist,
    } );
}
);


// @desc    Remove product to wishlist
// @route   DELETE  /api/v1/wishlist/:productId
// @access  Protected/User
exports.removeProductToWishList = asyncHandler( async ( req, res, next ) => {
    const user = await User.findByIdAndUpdate( req.user._id,
        {
            // $pull - remove from array
            $pull: {
                wishlist: req.params.productId,
            },
        },
        {
            new: true
        }
    );

    res.status( 200 ).json( {
        status: 'success',
        message: 'Product removed from wishlist successfully',
        data: user.wishlist,
    } );
}
);