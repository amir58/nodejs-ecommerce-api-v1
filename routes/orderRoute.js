const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

const {
  getOrderValidator,
  createOrderValidator,
  updateOrderValidator,
  deleteOrderValidator,
} = require( "../utils/validators/brandValidators" )

const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require( "../services/orderService" );

const router = express.Router();

router.use( protect, allowTo( "user" ) );

router
  .route( "/" )
  .get( getOrders )
  .post(
    // createOrderValidator,
    createOrder,
  );

// router
//   .route( "/:id" )
//   .get( getOrderValidator, getOrder )
//   .put(
//     updateOrderValidator,
//     updateOrder,
//   )
//   .delete(
//     deleteOrderValidator,
//     deleteOrder,
//   );

module.exports = router;
