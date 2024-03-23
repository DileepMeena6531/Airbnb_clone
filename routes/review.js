const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const { validationReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController=require("../controllers/review");

//review
//create review
router.post("/",isLoggedIn,validationReview,wrapAsync(reviewController.createReview))

//Delete review 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;