const stripe = require( "stripe" )( process.env.STRIPE_SECRET_KEY );
const asyncHandler = require( "express-async-handler" );

const ApiError = require( "../utils/apiError" );
const Order = require( "../models/orderModel" );
const Cart = require( "../models/cartModel" );
const Product = require( "../models/productModel" );
const User = require( "../models/userModel" );
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

// @desc    Get checkout session from stripe and send it as response
// @route   PUT /api/v1/orders/checkout
// @access  Private/Protect/User
exports.getCheckoutSession = asyncHandler( async ( req, res, next ) => {
    const cart = await Cart.findOne( { user: req.user._id } );


    if ( !cart ) {
        return next( new ApiError( `Cart not found`, 404 ) );
    }

    const cartPrice = cart.totlaPriceAfterDiscount
        ? cart.totlaPriceAfterDiscount
        : cart.totalPrice;

    // const session = await stripe.checkout.sessions.create( {
    //     line_items: [
    //         {
    //             quantity: 1,
    //             price_data: {
    //                 currency: "EGP",
    //                 unit_amount: cartPrice * 100,
    //                 product_data: {
    //                     name: cart.items[ 0 ].name
    //                 },
    //             },
    //         },
    //     ],
    //     mode: 'payment',
    //     success_url: `${ process.env.BASE_URL }/success.html`,
    //     cancel_url: `${ process.env.BASE_URL }/cancel.html`,
    //     customer_email: req.user.email,
    //     client_reference_id: cart._id,
    //     metadata: req.body.shippingAddress,
    // } );
    const session = await stripe.checkout.sessions.create( {
        line_items: [
            {
                price_data: {
                    currency: "AED",
                    unit_amount: cartPrice * 100,
                    product_data: { name: req.user.name },
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${ req.protocol }://${ req.get( "host" ) }/orders`, ///req.protocol: http or https, req.get('host):
        cancel_url: `${ req.protocol }://${ req.get( "host" ) }/cart`,
        customer_email: req.user.email,
        client_reference_id: cart._id,
        metadata: req.body.shippingAddress,
    } );


    res.status( 200 ).json( {
        status: 'success',
        url: session.url
    } );

} );


const createCartOrder = async ( session ) => {
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const orderPrice = session.display_items[ 0 ].unit_amount / 100;

    const cart = await Cart.findById( cartId );
    // const user = await User.findById( cart.user );
    const user = await User.findOne( { email: session.customer_email } );

    // Create order
    const order = await Order.create( {
        user: user._id,
        cartItems: cart.items,
        shippingAddress: shippingAddress,
        totalPrice: orderPrice,
        paymentMethod: "card",
        isPaid: true,
        paidAt: Date.now(),
    } );

    // Decrease product quantity, increase product sold
    if ( order ) {
        const bulkOptions = cart.items.map( item => ( {
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
            },
        } ) );

        await Product.bulkWrite( bulkOptions );

        // Clear cart
        await Cart.findOneAndUpdate( { _id: cartId }, { $set: { items: [], } } );

        return order;
    }
}

// @desc    Weebhook checkout
// @route   PUT /webhooks-checkout
// @access  Private/Protect/User
exports.webhookCheckout = asyncHandler( async ( req, res, next ) => {
    console.log( "Webhook checkout" );

    const signature = req.headers[ "stripe-signature" ];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOKS_SECRET
        );
    } catch ( err ) {
        console.log( `Webhook error: ${ err.message }` );
        return res.status( 400 ).send( `Webhook Error: ${ err.message }` );
    }

    console.log( `Event type: ${ event.type }` );

    if ( event.type === "checkout.session.completed" ) {
        console.log( 'Create Order Here.......' );
        console.log( event.data.object.client_reference_id );
        const order = await createCartOrder( event.data.object );
        res.status( 200 ).json( { order } );
    }

} );