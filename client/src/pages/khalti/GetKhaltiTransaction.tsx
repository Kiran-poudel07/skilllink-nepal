import { useEffect, useState } from "react";
import axiosConfig from "../../config/axios.config";

interface Payment {
  _id: string;
  student: { _id: string; name: string };
  gig: { _id: string; title: string };
  application: string;
  amount: number;
  txnId: string;
  paymentMethod: string;
  status: string;
  rawData: { refunded: boolean };
  createdAt: string;
}

const PaymentsTablePage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosConfig.get("/payment/");
        setPayments(res.data.payments || []);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          Payment Records
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
            <thead className="bg-indigo-500 text-white">
              <tr>
                <th className="py-2 px-3 text-left text-sm">Student Name</th>
                <th className="py-2 px-3 text-left text-sm">Student ID</th>
                <th className="py-2 px-3 text-left text-sm">Gig Title</th>
                <th className="py-2 px-3 text-left text-sm">Gig ID</th>
                <th className="py-2 px-3 text-left text-sm">Application ID</th>
                <th className="py-2 px-3 text-left text-sm">Amount</th>
                <th className="py-2 px-3 text-left text-sm">Txn ID</th>
                <th className="py-2 px-3 text-left text-sm">Payment Method</th>
                <th className="py-2 px-3 text-left text-sm">Refunded</th>
                <th className="py-2 px-3 text-left text-sm">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="py-2 px-3">{payment.student.name}</td>
                  <td className="py-2 px-3">{payment.student._id}</td>
                  <td className="py-2 px-3">{payment.gig.title}</td>
                  <td className="py-2 px-3">{payment.gig._id}</td>
                  <td className="py-2 px-3">{payment.application}</td>
                  <td className="py-2 px-3">Rs. {payment.amount}</td>
                  <td className="py-2 px-3">{payment.txnId}</td>
                  <td className="py-2 px-3">{payment.paymentMethod}</td>
                  <td className="py-2 px-3">{payment.rawData.refunded ? "Yes" : "No"}</td>
                  <td className="py-2 px-3">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PaymentsTablePage;
