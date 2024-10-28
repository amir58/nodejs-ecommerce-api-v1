const asyncHandler = require( "express-async-handler" );

const ApiError = require( "../utils/apiError" );
const Order = require( "../models/orderModel" );
const Cart = require( "../models/cartModel" );
const Product = require( "../models/productModel" );
const factory = require( "./handlersFactory" );


// @desc    Create Order
// @route   POST /api/v1/orders
// @access  Private/Protect/User
exports.createOrder = asyncHandler( async ( req, res, next ) => {
    // App Settings 
    const taxPrice = 1;
    const shippingPrice = 1;

    // 1) Get cart depend on cartId
    const cart = await Cart.findOne( { user: req.user._id } );

    if ( !cart ) {
        return next( new ApiError( `Cart not found`, 404 ) );
    }

    // 2) Get order price depend on cart price, check if coupon apply
    const cartTotalPrice = cart.totlaPriceAfterDiscount ? cart.totlaPriceAfterDiscount : cart.totalPrice;

    const orderTotalPrice = cartTotalPrice + taxPrice + shippingPrice;

    // 3) Create order with default payment method type cash

    const order = await Order.create( {
        user: req.user._id,
        cartItems: cart.items,
        shippingAddress: req.body.shippingAddress,
        totalPrice: orderTotalPrice,
    } );
    // 4) Decrease product quantity, increase product sold
    if ( order ) {
        const bulkOptions = cart.items.map( item => ( {
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
            }
        } ) );

        await Product.bulkWrite( bulkOptions );

        // 5) Delete cart
        await cart.deleteOne();
    }

    res.status( 201 ).json( {
        status: 'success',

        order
    } );

} );

// @desc    Get list of orders
// @route   GET /api/v1/orders
// @access  Private/Protect/User
exports.getOrders = factory.getAll( Order );

// @desc    Get specific Order
// @route   GET /api/v1/orders/:id
// @access  Private/Protect/User
exports.getOrder = factory.getOne( Order );

// @desc    Update Order
// @route   PUT /api/v1/orders/:id
// @access  Private/Protect/User
exports.updateOrder = factory.updateOne( Order );

// @desc    Delete Order
// @route   DELETE /api/v1/orders/:id
// @access  Private/Protect/User
exports.deleteOrder = factory.deleteOne( Order );

