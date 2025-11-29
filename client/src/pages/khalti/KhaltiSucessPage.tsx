import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axiosConfig from "../../config/axios.config";

const KhaltiSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const paymentData = {
    pidx: searchParams.get("pidx"),
    transaction_id: searchParams.get("transaction_id"),
    tidx: searchParams.get("tidx"),
    txnId: searchParams.get("txnId"),
    amount: searchParams.get("amount"),
    total_amount: searchParams.get("total_amount"),
    mobile: searchParams.get("mobile"),
    status: searchParams.get("status"),
    purchase_order_id: searchParams.get("purchase_order_id"),
    purchase_order_name: searchParams.get("purchase_order_name"),
  };

  const [verifyPidx, setVerifyPidx] = useState(paymentData.pidx || "");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  } | null>(null);

  const handleVerify = async () => {
    if (!verifyPidx) return alert("Please enter Pidx to verify");

    setLoading(true);
    try {
      const res = await axiosConfig.post("/payment/verify", { pidx: verifyPidx });
      const result = res.data
      if (res) {
        setPopup({ message: "Payment verified successfully!", type: "success", visible: true });

        setTimeout(() => {
          navigate("/employer/applications");
        }, 5000);
      } else {
        setPopup({ message: result?.payment?.message || "Verification failed", type: "error", visible: true });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setPopup({ message: "Something went wrong while verifying payment", type: "error", visible: true });
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    if (popup) setPopup({ ...popup, visible: false });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md text-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          Payment Successful!
        </h2>

        <div className="space-y-3 mb-6">
          {Object.entries(paymentData).map(([key, value]) => (
            <div key={key}>
              <span className="font-medium">{key.replace(/_/g, " ")}:</span>{" "}
              {value}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Enter Pidx to Verify</label>
          <input
            type="text"
            value={verifyPidx}
            onChange={(e) => setVerifyPidx(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Pidx"
          />
        </div>
        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full mb-4 text-white font-medium py-2 rounded-lg shadow transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90"
          }`}
        >
          {loading ? "Verifying..." : "Verify Payment"}
        </button>

        <button
          onClick={() => navigate("/employer/applications")}
          className="w-full text-center bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-lg shadow transition"
        >
          Back to Applications
        </button>

        {popup && popup.visible && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white flex items-center justify-between space-x-4 bg-white border">
            <span
              className={`font-medium ${
                popup.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {popup.message}
            </span>
            <button
              onClick={closePopup}
              className={`ml-4 px-3 py-1 rounded text-white font-semibold ${
                popup.type === "success" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Okay
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default KhaltiSuccessPage;
