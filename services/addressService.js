const asyncHandler = require( 'express-async-handler' );

const User = require( '../models/userModel' );


// @desc    Add address
// @route   POST  /api/v1/addresses
// @access  Protected/User
exports.addAddress = asyncHandler( async ( req, res, next ) => {
    const user = await User.findByIdAndUpdate( req.user._id,
        {
            // Set adresses as an array
            // Set don't allow duplicate values
            $addToSet: {
                addresses: req.body,
            },
        },
        {
            new: true
        }
    );

    res.status( 200 ).json( {
        status: 'success',
        message: 'Address added successfully',
        data: user.addresses,
    } );
}
);

// @desc    Get logged user addresses
// @route   GET  /api/v1/addresses
// @access  Protected/User
exports.getLoggedUserAddresses = asyncHandler( async ( req, res, next ) => {
    const user = await User.findById( req.user._id );

    res.status( 200 ).json( {
        status: 'success',
        data: user.addresses,
    } );
}
);


// @desc    Remove address
// @route   DELETE  /api/v1/wishlist/:productId
// @access  Protected/User
exports.removeAddress = asyncHandler( async ( req, res, next ) => {
    const user = await User.findByIdAndUpdate( req.user._id,
        {
            // $pull - remove from array
            $pull: {
                addresses: { _id: req.params.addressId },
            },
        },
        {
            new: true
        }
    );

    res.status( 200 ).json( {
        status: 'success',
        message: 'Adress removed successfully',
        data: user.addresses,
    } );
}
);