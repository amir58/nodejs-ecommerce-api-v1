const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require( "../utils/validators/reviewValidators" )

const {
  createFilterObject,
  getReviews,
  getReview,
  setProductIdAndUserIdToBody,
  createReview,
  updateReview,
  deleteReview,

} = require( "../services/reviewService" );

const router = express.Router( { mergeParams: true } );

router
  .route( "/" )
  .get( createFilterObject, getReviews )
  .post(
    protect,
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview,
  );

router
  .route( "/:id" )
  .get(
    getReviewValidator,
    getReview,
  )
  .put(
    protect,
    allowTo( "user" ),
    updateReviewValidator,
    updateReview,
  )
  .delete(
    protect,
    deleteReviewValidator,
    deleteReview,
  );


module.exports = router;
