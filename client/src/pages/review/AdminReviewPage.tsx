import React, { useEffect, useState } from "react";
import axiosConfig from "../../config/axios.config";
import { AiFillStar, AiFillDelete } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/auth.context";

interface ImageObj {
  publicId: string;
  url: string;
  optimizedUrl: string;
}

interface UserObj {
  _id: string;
  name: string;
  image: ImageObj;
}

interface GigObj {
  _id: string;
  title: string;
}

export interface Review {
  _id: string;
  reviewer: UserObj;
  reviewee: UserObj;
  gig: GigObj;
  application: string;
  rating: number;
  title: string;
  comment: string;
  anonymous: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface MetaData {
  page: number;
  limit: number;
  totalReviews: number;
  averageRating: number;
}

interface ApiResponse {
  status: string;
  data: Review[];
  meta: MetaData;

}


const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const limit = 20;

  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const [searchId, setSearchId] = useState<string>("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { loggedInUser } = useAuth();
  const userId = loggedInUser?._id;


  const fetchReviews = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (ratingFilter) params.append("rating", ratingFilter.toString());
      if (sort) params.append("sort", sort);
      if (search.trim()) params.append("search", search.trim());

      const response = await axiosConfig.get<ApiResponse>(
        `review/admin?${params.toString()}`
      );

      setReviews(response.data.data || []);
      setMeta(response.data.meta || null);
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchId.trim()) fetchReviews();
  }, [page, search, sort, ratingFilter, userId]);


  const searchSingleReview = async () => {
    if (!searchId.trim()) {
      fetchReviews();
      return;
    }

    try {
      setLoading(true);

      const response = await axiosConfig.get<ApiResponse>(
        `/review/${searchId}`
      );

      // console.log(response.data.data)
      setReviews(response.data.data);
      // setMeta({
      //   page: 1,
      //   limit: 1,
      //   averageRating: response.data.meta.rating,
      //   totalReviews: 1,
      // });
    } catch (err) {
      alert("Review not found");
      fetchReviews();
    } finally {
      setLoading(false);
    }
  };


  const deleteReview = async (id: string) => {
    try {
      await axiosConfig.delete(`/review/${id}`);

      setReviews((prev) => prev.filter((r) => r._id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  const totalPages = meta ? Math.ceil(meta.totalReviews / meta.limit) : 1;

  const SkeletonCard: React.FC = () => (
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
      <div
      className="min-h-screen w-full p-4 md:p-8 
      bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50
      relative overflow-hidden"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center md:text-left">
        Your Reviews
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">

        <input
          type="text"
          placeholder="Search reviews..."
          className="p-3 border rounded-xl w-full md:w-1/3 shadow-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <div className="flex gap-2 w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by Review ID..."
            className="p-3 border rounded-xl w-full shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />

          <button
            onClick={searchSingleReview}
            className="px-4 py-2 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition"
          >
            Go
          </button>
        </div>

        <select
          className="p-3 border rounded-xl w-full md:w-1/4 shadow-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
          value={sort}
          onChange={(e) => {
            setPage(1);
            setSort(e.target.value);
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="high">Highest Rating</option>
          <option value="low">Lowest Rating</option>
        </select>

        <select
          className="p-3 border rounded-xl w-full md:w-1/4 shadow-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
          value={ratingFilter ?? ""}
          onChange={(e) => {
            setPage(1);
            setRatingFilter(e.target.value ? Number(e.target.value) : null);
          }}
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars Only</option>
          <option value="4">4 Stars Only</option>
          <option value="3">3 Stars Only</option>
        </select>
      </div>

      {meta && (
        <div className="flex items-center gap-3 mb-8 bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-5 py-3 rounded-2xl shadow-lg w-fit">
          <span className="text-2xl md:text-3xl font-bold">
            {meta.averageRating.toFixed(1)}
          </span>
          <AiFillStar className="text-2xl md:text-3xl" />
          <span className="text-white/90 text-sm md:text-base">
            ({meta.totalReviews} reviews)
          </span>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      )}

      {!loading && reviews?.length === 0 && (
        <div className="text-center text-gray-500 text-lg mt-10">
          No reviews found
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {reviews.map((review) => (
            <motion.div
              key={review._id}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition hover:scale-105 flex flex-col justify-between h-full"
              onClick={() => setSelectedReview(review)}
            >
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={review.reviewer.image.optimizedUrl}
                  alt="dp"
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                />
                <div className="flex flex-col">
                  <h2 className="font-semibold text-lg text-gray-800 break-all">
                    {review.reviewer.name}
                  </h2>
                  <p className="text-sm text-gray-500 break-all">
                    {review.gig?.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <AiFillStar
                    key={i}
                    className={`text-xl ${i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                  />
                ))}
              </div>

              <h3 className="font-semibold text-md text-gray-700">
                {review.title}
              </h3>

              <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                {review.comment}
              </p>

              <div className="mt-4 flex justify-center">
                <button
                  className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-xl shadow hover:bg-red-600 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteId(review._id);
                  }}
                >
                  <AiFillDelete />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && meta && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-xl bg-white shadow disabled:opacity-40"
          >
            Prev
          </button>

          <span className="font-semibold">
            Page {meta.page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-xl bg-white shadow disabled:opacity-40"
          >
            Next
          </button>
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
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
                {selectedReview.title}
              </h2>

              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <AiFillStar
                    key={i}
                    className={`text-2xl ${i < selectedReview.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                      }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 mb-6 text-sm md:text-base">
                {selectedReview.comment}
              </p>

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

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[300px]">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Are you sure?
            </h2>

            <p className="text-center mb-6 text-gray-600">
              Do you want to delete this review?
            </p>

            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition"
                onClick={() => setConfirmDeleteId(null)}
              >
                No
              </button>

              <button
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                onClick={() => deleteReview(confirmDeleteId)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default AdminReviewsPage;
