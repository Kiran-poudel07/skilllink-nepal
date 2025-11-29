import React, { useEffect, useState } from "react";
import axiosConfig from "../../config/axios.config";
import { AiFillStar } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/auth.context";

const StudentReviewsPage = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const { loggedInUser } = useAuth();
  const userId = loggedInUser?._id;

  const fetchReviews = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", "20");
      if (ratingFilter) params.append("rating", ratingFilter.toString());
      if (sort) params.append("sort", sort);
      if (search.trim()) params.append("search", search.trim());

      const response = await axiosConfig.get(`/review/user/${userId}?${params.toString()}`);
      setReviews(response.data?.data || []);
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [search, sort, ratingFilter, userId]);

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white shadow-md rounded-2xl p-5 w-full h-60 flex flex-col gap-2">
      <div className="h-16 w-16 bg-gray-300 rounded-lg mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
      <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen w-full p-4 md:p-8 
        bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50
        relative overflow-hidden">

      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center md:text-left">Your Reviews</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">

        <input
          type="text"
          placeholder="Search reviews..."
          className="p-3 border rounded-xl w-full md:w-1/3 shadow-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 border rounded-xl w-full md:w-1/4 shadow-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="high">Highest Rating</option>
          <option value="low">Lowest Rating</option>
        </select>

        <select
          className="p-3 border rounded-xl w-full md:w-1/4 shadow-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
          value={ratingFilter ?? ""}
          onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars Only</option>
          <option value="4">4 Stars Only</option>
          <option value="3">3 Stars Only</option>
        </select>
      </div>

      {reviews.length > 0 && (
        <div className="flex items-center gap-3 mb-8 bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-5 py-3 rounded-2xl shadow-lg w-fit">
          <span className="text-2xl md:text-3xl font-bold">
            {(reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)}
          </span>
          <AiFillStar className="text-2xl md:text-3xl" />
          <span className="text-white/90 text-sm md:text-base">({reviews.length} reviews)</span>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="text-center text-gray-500 text-lg mt-10">
          No reviews found
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer hover:scale-105 flex flex-col justify-between h-full"
              onClick={() => setSelectedReview(review)}
            >
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={review.reviewer.image.optimizedUrl}
                  alt="dp"
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                />
                <div className="flex flex-col">
                  <h2 className="font-semibold text-lg text-gray-800 break-all flex-1">{review.reviewer.name}</h2>
                  <p className="text-sm text-gray-500 break-all flex-1">{review.gig.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <AiFillStar
                    key={i}
                    className={`text-xl ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                  />
                ))}
              </div>

              <h3 className="font-semibold text-md md:text-lg text-gray-700">{review.title}</h3>
              <p className="text-sm md:text-base text-gray-600 mt-1 line-clamp-3">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedReview && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">{selectedReview.title}</h2>

              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <AiFillStar
                    key={i}
                    className={`text-2xl ${i < selectedReview.rating ? "text-yellow-500" : "text-gray-300"}`}
                  />
                ))}
              </div>

              <p className="text-gray-700 mb-6 text-sm md:text-base">{selectedReview.comment}</p>

              <button
                onClick={() => setSelectedReview(null)}
                className="mt-3 w-full bg-gradient-to-r from-yellow-400 to-pink-400 text-white py-3 rounded-xl shadow hover:opacity-90 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
    
  );
};

export default StudentReviewsPage;
