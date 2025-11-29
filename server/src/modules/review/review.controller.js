const reviewSvc = require("./review.service");

class ReviewController {
  async createReview(req, res, next) {
    try {
      const reviewerId = req.loggedInUser._id;
      const payload = req.body;
      const review = await reviewSvc.createReview(reviewerId, payload);
      res.status(201).json({ status: "success", message: "Review created", data: {review} });
    } catch (err) {
      next(err);
    }
  }

 async getUserReviews(req, res, next) {
  try {
    const userId = req.params.userId;

   
    const result = await reviewSvc.getReviewsForUser(userId, req.query);

    res.json({
      status: "success",
      data: {
        data: result.reviews,
        meta: result.meta,
      },
    });
  } catch (err) {
    next(err);
  }
}

  async getGigReviews(req, res, next) {
    try {
      const gigId = req.params.gigId;
      const result = await reviewSvc.getReviewsForGig(gigId, req.query);
      res.json({ status: "success", data: result.reviews, meta: result.meta });
    } catch (err) {
      next(err);
    }
  }
  getAllReviewsForAdmin = async (req, res, next) => {
  try {
    const result = await reviewSvc.getAllReviewsForAdmin(req.query);
    res.json({
      status: "success",
      data: {
        data: result.reviews,
        meta: result.meta,
      },
    });
  } catch (err) {
    next(err);
  }
};

  async getReviewById(req, res, next) {
    try {
      const data = await reviewSvc.getReviewById(req.params.id);
      res.json({ status: "success", data: {data} });
    } catch (err) {
      next(err);
    }
  }

  async deleteReview(req, res, next) {
    try {
      const requesterId = req.loggedInUser._id;
      const result = await reviewSvc.deleteReview(req.params.id, requesterId);
      res.json({ status: "success", message: result.message });
    } catch (err) {
      next(err);
    }
  }
}
const reviewCtrl = new ReviewController();
module.exports = reviewCtrl
