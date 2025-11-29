const express = require("express");
const reviewRouter = express.Router();
const reviewCtrl = require("./review.controller");
const { createReviewSchema, deleteReviewSchema, getReviewsQuerySchema } = require("./review.validator");
const { auth } = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const { userRoles } = require("../../config/constant");

reviewRouter.post("/", auth(), bodyValidator(createReviewSchema), reviewCtrl.createReview);


reviewRouter.get("/user/:userId", auth(), bodyValidator(getReviewsQuerySchema), reviewCtrl.getUserReviews);


reviewRouter.get("/gig/:gigId", auth(), bodyValidator(getReviewsQuerySchema), reviewCtrl.getGigReviews);

reviewRouter.get("/admin", auth(userRoles.ADMIN), reviewCtrl.getAllReviewsForAdmin);


reviewRouter.get("/:id", auth(userRoles.ADMIN), reviewCtrl.getReviewById);


reviewRouter.delete("/:id", auth(userRoles.ADMIN), reviewCtrl.deleteReview);

module.exports = reviewRouter;
