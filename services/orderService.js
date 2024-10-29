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

exports.filterOrderForLoggedUsers = asyncHandler( async ( req, res, next ) => {
    if ( req.user.role === "user" ) {
        req.filterObject = { user: req.user._id };
    }
    next();
} )


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

// @desc    Update Order To Paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private/Protect/Admin-Manager
exports.updateOrderToPaid = asyncHandler( async ( req, res, next ) => {
    const order = await Order.findById( req.params.id );

    if ( !order ) {
        return next( new ApiError( `order not found`, 404 ) );
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status( 200 ).json( {
        status: 'success',
        data: updatedOrder,
    } );
} );

// @desc    Update Order To Delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Protect/Admin-Manager
exports.updateOrderToDelivered = asyncHandler( async ( req, res, next ) => {
    const order = await Order.findById( req.params.id );

    if ( !order ) {
        return next( new ApiError( `order not found`, 404 ) );
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status( 200 ).json( {
        status: 'success',
        data: updatedOrder,
    } );
} );

