import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router";
import axiosConfig from "../../config/axios.config";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { applicationId } = location.state || {};

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) return toast.error("Please select a rating.");
    if (!title.trim()) return toast.error("Title is required.");
    if (!comment.trim()) return toast.error("Comment is required.");

    const data = {
      applicationId,
      rating,
      title,
      comment,
      anonymous: false,
    };

    try {
      setLoading(true);

      await axiosConfig.post("/review", data);

      toast.success("Review submitted successfully!");
      navigate(-1);

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen w-full flex items-center justify-center relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-[50%] bg-yellow-200/70"></div>

      <div className="absolute bottom-0 left-0 w-full h-[50%] bg-pink-200/70"></div>

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-[90%] max-w-md p-8 rounded-2xl shadow-2xl bg-white/80 backdrop-blur-md border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Write a Review</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex flex-col gap-1">
            <label className="font-medium">Application ID</label>
            <input
              type="text"
              value={applicationId}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium flex justify-between">
              <span>Rating</span>
              <span className="text-sm text-gray-600">{rating}/5</span>
            </label>

            <div className="flex gap-2 text-3xl cursor-pointer">
              {[1, 2, 3, 4, 5].map((num) => (
                <motion.div
                  key={num}
                  onClick={() => setRating(num)}
                  whileTap={{ scale: 1.3 }}
                  transition={{ duration: 0.15 }}
                >
                  {rating >= num ? (
                    <AiFillStar className="text-yellow-500 drop-shadow-sm" />
                  ) : (
                    <AiOutlineStar className="text-gray-400" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Great work!"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none bg-white/70"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Comment</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your experience..."
              className="border p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 resize-none outline-none bg-white/70"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-pink-400 text-white py-3 rounded-lg text-lg font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </motion.div>
    </div>
    </>
  );
};

export default ReviewPage;
