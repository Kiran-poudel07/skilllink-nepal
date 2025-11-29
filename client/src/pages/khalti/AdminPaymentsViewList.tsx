import { useEffect, useState } from "react";
import axiosConfig from "../../config/axios.config";

interface IUser {
  _id: string;
  name: string;
  email: string;
}

interface IGig {
  _id: string;
  title: string;
}

interface IApplication {
  _id: string;
  status: string;
}

export interface IPayment {
  _id: string;
  employer: IUser;
  student: IUser;
  gig: IGig;
  application: IApplication;
  amount: number;
  txnId: string;
  paymentMethod: string;
  createdAt: string;
}

interface IBackendResponse {
  status: string;
  message: string;
  data: {
    data: IPayment[];
    total: number;
    page: number;
    limit: number;
  };
}

const PaymentsPage = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);


  const fetchPayments = async () => {
    try {
      setLoading(true);

      const response = await axiosConfig.get<IBackendResponse>(
        "/payment/admin/all",
        {
          params: {
            page,
            limit,
            status: status || undefined,
            q: search || undefined,
          },
        }
      );
      const result = response.data.data;

      setPayments(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, status]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPayments();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Payment Records</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            className="border p-2 rounded w-full md:w-1/3"
            placeholder="Search by txnId or remarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded w-full md:w-1/4"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Payment ID</th>
                <th className="px-4 py-3 text-left">Employer</th>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Gig</th>
                <th className="px-4 py-3 text-left">Application</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Txn ID</th>
                <th className="px-4 py-3 text-left">Method</th>
                <th className="px-4 py-3 text-left">Created At</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : payments?.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((p, index) => (
                  <tr
                    key={p._id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-3 text-indigo-700 font-semibold">
                      {p._id}
                    </td>

                    <td className="px-4 py-3 text-green-700">
                      <div>{p.employer?.name}</div>
                      <div className="text-xs text-gray-500">
                        {p.employer?.email}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-blue-700">
                      <div>{p.student?.name}</div>
                      <div className="text-xs text-gray-500">
                        {p.student?.email}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-purple-700">
                      <div>{p.gig?.title}</div>
                      <div className="text-xs">{p.gig?._id}</div>
                    </td>

                    <td className="px-4 py-3 text-amber-700">
                      <div>{p.application?.status}</div>
                      <div className="text-xs">{p.application?._id}</div>
                    </td>

                    <td className="px-4 py-3 font-bold text-gray-800">
                      Rs. {p.amount}
                    </td>

                    <td className="px-4 py-3 text-pink-700">{p.txnId}</td>

                    <td className="px-4 py-3 text-gray-700">
                      {p.paymentMethod}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </button>

          <div className="font-semibold">
            Page {page} / {Math.ceil(total / limit) || 1}
          </div>

          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            disabled={page * limit >= total}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentsPage;
