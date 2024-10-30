exports.sanitizeUser = function ( user ) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        wishlist: user.wishlist,
        address: user.address,
    };
};