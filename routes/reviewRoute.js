const express = require( "express" );

const { protect, allowTo } = require( "../services/authService" );

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require( "../utils/validators/reviewValidators" )

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,

} = require( "../services/reviewService" );

const router = express.Router();

router
  .route( "/" )
  .get( getReviews )
  .post(
    protect,
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
