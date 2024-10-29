const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

const {
  getOrderValidator,
  createOrderValidator,
  updateOrderValidator,
  deleteOrderValidator,
} = require( "../utils/validators/brandValidators" )

const {
  createOrder,
  filterOrderForLoggedUsers,
  getOrders,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  deleteOrder,
} = require( "../services/orderService" );

const router = express.Router();

router.use( protect );

router
  .route( "/" )
  .get(
    allowTo( "user", "admin", "manager" ),
    filterOrderForLoggedUsers,
    getOrders
  )
  .post(
    allowTo( "user" ),
    // createOrderValidator,
    createOrder,
  );

router
  .route( "/:id" )
  .get(
    allowTo( "user", "admin", "manager" ),
    // getOrderValidator,
    getOrder,
  )
//   .put(
//     updateOrderValidator,
//     updateOrder,
//   )
//   .delete(
//     deleteOrderValidator,
//     deleteOrder,
//   );

router
  .route( "/:id/pay" )
  .put(
    allowTo( "admin", "manager" ),
    updateOrderToPaid,
  )
router
  .route( "/:id/deliver" )
  .put(
    allowTo( "admin", "manager" ),
    updateOrderToDelivered,
  )

module.exports = router;
