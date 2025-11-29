import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axiosConfig from "../../config/axios.config";

const KhaltiInitiatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { gigId, applicationId, gigTitle } = location.state || {};
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!gigId || !applicationId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-500 text-lg text-center">
          Invalid payment data. Go back and try again.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0)
      return alert("Please enter a valid amount");

    setLoading(true);
    try {
      const paymentData = {
        gigId,
        applicationId,
        amount: Number(amount),
      };

      const res = await axiosConfig.post("/payment/initiate", paymentData);
      const paymentUrl = res.data?.data?.payment_url;

      if (paymentUrl) {
        window.open(paymentUrl, "_blank");
      } else {
        alert("Failed to initiate payment: " + res.data?.message);
        console.error(res.data);
      }
    } catch (err) {
      console.error("Error initiating payment:", err);
      alert("Something went wrong while initiating payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Khalti Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Gig ID</label>
            <input
              type="text"
              value={gigId}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Application ID
            </label>
            <input
              type="text"
              value={applicationId}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Amount (Rs.)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to pay"
              min={1}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-medium py-2 rounded-lg shadow transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
            }`}
          >
            {loading ? "Processing..." : "Proceed to Pay"}
          </button>
        </form>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 w-full text-center text-indigo-500 underline"
        >
          Back to Applications
        </button>
      </div>
    </div>
    </>
  );
};

export default KhaltiInitiatePage;
