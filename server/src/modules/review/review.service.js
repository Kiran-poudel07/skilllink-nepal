const ReviewModel = require("./review.model");
const ApplicationModel = require("../application/application.model");
const GigModel = require("../gig/gig.model");
const PaymentModel = require("../payment/payment.model");
const NotificationService = require("../notification/notification.service");
const mongoose = require("mongoose");
const UserModel = require("../user/user.model");

class ReviewService {
    
    async createReview(reviewerId, payload) {
        const { applicationId, rating, title, comment, anonymous } = payload;

        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            throw { statusCode: 400, message: "Invalid applicationId" };
        }

        const application = await ApplicationModel.findById(applicationId).populate("gig student");
        if (!application) throw { statusCode: 404, message: "Application not found" };

        const gig = await GigModel.findById(application.gig);
        if (!gig) throw { statusCode: 404, message: "Associated gig not found" };

       
        const isStudentReviewer = application.student._id.equals(reviewerId);
        const isEmployerReviewer = gig.employer.equals(reviewerId);

        if (!isStudentReviewer && !isEmployerReviewer) {
            throw { statusCode: 403, message: "Only participants of this application can leave reviews" };
        }

        
        const revieweeId = isStudentReviewer ? gig.employer : application.student._id;
        if (revieweeId.equals(reviewerId)) {
            throw { statusCode: 400, message: "Cannot review yourself" };
        }

      
        const payment = await PaymentModel.findOne({
            application: application._id,
            status: "SUCCESS"
        });
        if (!payment) {
            throw { statusCode: 400, message: "Payment not found for this application. Reviews require completed payment." };
        }

       
        const existing = await ReviewModel.findOne({ reviewer: reviewerId, application: application._id });
        if (existing) throw { statusCode: 400, message: "You have already reviewed this application" };

        const review = await ReviewModel.create({
            reviewer: reviewerId,
            reviewee: revieweeId,
            gig: gig._id,
            application: application._id,
            rating,
            title,
            comment,
            anonymous: !!anonymous,
            status: "VISIBLE"
        });

        
        const reviewerUser = await UserModel.findById(reviewerId).select("name");
        const notifTitle = `New review received for "${gig.title}"`;
        const notifMessage = `${reviewerUser ? reviewerUser.name : "Someone"} left a ${rating}★ review. ${title || ""}`;

        await NotificationService.createNotification({
            recipient: revieweeId,
            sender: reviewerId,
            type: "review_received",
            title: notifTitle,
            message: notifMessage,
            gig: gig._id
        });

        return review.populate([
            { path: "reviewer", select: "name image" },
            { path: "reviewee", select: "name image" },
            { path: "gig", select: "title" }
        ]);
    }

    
    async getReviewsForUser(userId, query = {}) {
        const page = Number(query.page) || 1;
        const limit = Math.min(Number(query.limit) || 10, 100);
        const skip = (page - 1) * limit;

        const ratingFilter = query.rating ? Number(query.rating) : null;
        const search = query.search ? query.search.toLowerCase() : null;
        const sortOption = query.sort || "newest"; 

        
        const filterQuery = { reviewee: userId, status: "VISIBLE" };
        if (ratingFilter) filterQuery.rating = ratingFilter;
        if (search) {
            filterQuery.$or = [
                { title: { $regex: search, $options: "i" } },
                { comment: { $regex: search, $options: "i" } },
            ];
        }

      
        let sortQuery = { createdAt: -1 }; 
        if (sortOption === "oldest") sortQuery = { createdAt: 1 };
        if (sortOption === "high") sortQuery = { rating: -1, createdAt: -1 };
        if (sortOption === "low") sortQuery = { rating: 1, createdAt: -1 };

       
        const [reviews, agg] = await Promise.all([
            ReviewModel.find(filterQuery)
                .populate("reviewer", "name image")
                .populate("gig", "title")
                .sort(sortQuery)
                .skip(skip)
                .limit(limit),
            ReviewModel.aggregate([
                { $match: { reviewee: new mongoose.Types.ObjectId(userId), status: "VISIBLE" } },
                ...(ratingFilter ? [{ $match: { rating: ratingFilter } }] : []),
                ...(search
                    ? [
                        {
                            $match: {
                                $or: [
                                    { title: { $regex: search, $options: "i" } },
                                    { comment: { $regex: search, $options: "i" } },
                                ],
                            },
                        },
                    ]
                    : []),
                {
                    $group: {
                        _id: "$reviewee",
                        averageRating: { $avg: "$rating" },
                        reviewCount: { $sum: 1 },
                    },
                },
            ]),
        ]);

        const aggregate = agg[0] || { averageRating: 0, reviewCount: 0 };

        return {
            reviews,
            meta: {
                page,
                limit,
                totalReviews: aggregate.reviewCount || 0,
                averageRating: aggregate.averageRating || 0,
            },
        };
    }


    
    async getReviewsForGig(gigId, query = {}) {
        const page = Number(query.page) || 1;
        const limit = Math.min(Number(query.limit) || 10, 100);
        const skip = (page - 1) * limit;

        const [reviews, agg] = await Promise.all([
            ReviewModel.find({ gig: gigId, status: "VISIBLE" })
                .populate("reviewer", "name image")
                .populate("reviewee", "name image")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            ReviewModel.aggregate([
                { $match: { gig: new mongoose.Types.ObjectId(gigId), status: "VISIBLE" } },
                {
                    $group: {
                        _id: "$gig",
                        averageRating: { $avg: "$rating" },
                        reviewCount: { $sum: 1 }
                    }
                }
            ])
        ]);

        const aggregate = agg[0] || { averageRating: 0, reviewCount: 0 };

        return { reviews, meta: { page, limit, totalReviews: aggregate.reviewCount || 0, averageRating: aggregate.averageRating || 0 } };
    }
    getAllReviewsForAdmin = async (query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(Number(query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  
  const filter = {};

  if (query.employer) filter.reviewer = query.employer;  
  if (query.student) filter.reviewee = query.student;    
  if (query.rating) filter.rating = Number(query.rating);
  if (query.search) filter.title = { $regex: query.search.trim(), $options: "i" };

 
  let sortBy = { createdAt: -1 }; 
  if (query.sort === "oldest") sortBy = { createdAt: 1 };
  if (query.sort === "highest") sortBy = { rating: -1 };
  if (query.sort === "lowest") sortBy = { rating: 1 };

  const [reviews, agg] = await Promise.all([
    ReviewModel.find(filter)
      .populate("reviewer", "name image")
      .populate("reviewee", "name image")
      .populate("gig", "title")
      .sort(sortBy)
      .skip(skip)
      .limit(limit),
    ReviewModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
    ]),
  ]);

  const aggregate = agg[0] || { totalReviews: 0, averageRating: 0 };

  return {
    reviews,
    meta: {
      page,
      limit,
      totalReviews: aggregate.totalReviews,
      averageRating: aggregate.averageRating,
    },
  };
};

    async getReviewById(id) {
        const review = await ReviewModel.findById(id)
            .populate("reviewer", "name image")
            .populate("reviewee", "name image")
            .populate("gig", "title");
        if (!review) throw { statusCode: 404, message: "Review not found" };
        return review;
    }

    async deleteReview(id, requesterId) {
        const review = await ReviewModel.findById(id);
        if (!review) throw { statusCode: 404, message: "Review not found" };

      
        const requester = await UserModel.findById(requesterId);

        if (!review.reviewer.equals(requesterId)) {
            
            if (!requester || requester.role !== "admin") {
                throw { statusCode: 403, message: "Not authorized to delete this review" };
            }
        }

        await ReviewModel.deleteOne({ _id: id });
        return { message: "Review deleted" };
    }

}
const reviewSvc = new ReviewService();
module.exports = reviewSvc
