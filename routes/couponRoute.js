const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

const {
  getCouponValidator,
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require( "../utils/validators/couponValidators" )

const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require( "../services/couponService" );

const router = express.Router();

router.use( protect, allowTo( "admin", "manager" ) );

router
  .route( "/" )
  .get( getCoupons )
  .post(
    createCouponValidator,
    createCoupon,
  );

router
  .route( "/:id" )
  .get( getCouponValidator, getCoupon )
  .put(
    updateCouponValidator,
    updateCoupon,
  )
  .delete(
    deleteCouponValidator,
    deleteCoupon,
  );

module.exports = router;
