const asyncHandler = require( 'express-async-handler' );

const round = require( '../utils/numbersUtil' );
const Cart = require( '../models/cartModel' );
const Product = require( '../models/productModel' );
// const ApiError = require( '../utils/apiError' );

const calculateTotalPrice = ( cart ) => {
    // Calculate total price and total price after discount
    // cart.totlaPrice = cart.items.reduce( ( acc, item ) => acc + item.price * item.quantity, 0 );

    let totalPrice = 0;
    cart.items.forEach( item => { totalPrice += item.price * item.quantity; } );
    return round( totalPrice, 2 );
}

// @desc    Add product to cart
// @route   POST  /api/v1/carts
// @access  Protected/User
exports.addProductToCart = asyncHandler( async ( req, res, next ) => {
    const { productId, color } = req.body;

    const product = await Product.findById( productId );

    let cart = await Cart.findOne( { user: req.user._id } );

    // Create cart for logged in user if not exist with product
    if ( !cart ) {
        cart = await Cart.create( {
            user: req.user._id,
            items: [ { product: productId, price: product.price, color, } ]
        } );
    }
    else {
        // Product exist in cart, upate product quantity
        const productExist = cart.items.findIndex( item =>
            item.product.toString() === productId
            && item.color === color
        );

        if ( productExist > -1 ) {
            cart.items[ productExist ].quantity += 1;
        }
        else {
            cart.items.push( { product: productId, price: product.price, color, quantity: 1 } );
        }
    }

    cart.totalPrice = calculateTotalPrice( cart );

    await cart.save();

    return res.status( 201 ).json( {
        status: 'success',
        message: 'Product added to cart successfully',
        data: cart,
    } );
} );

