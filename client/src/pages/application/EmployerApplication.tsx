import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import axiosConfig from "../../config/axios.config";
import { useNavigate } from "react-router";

const EmployerApplicationsPage = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [status, setStatus] = useState("");

  const [confirmModal, setConfirmModal] = useState<{ show: boolean; appIndex: number | null; newStatus: string }>({
    show: false,
    appIndex: null,
    newStatus: "",
  });

  const toggleExpand = (index: number) => {
    setExpanded((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosConfig.get("/application/employer/me", {
        params: { page, limit: 6, search, status, sort },
      });
      setApplications(res.data.data ?? []);
      setTotalPages(res.data.pages?.totalPages ?? 1);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, sort, search, status]);

  const handleUpdateStatus = async () => {
    if (confirmModal.appIndex === null) return;
    const app = applications[confirmModal.appIndex];
    try {
      await axiosConfig.patch(`/application/${app._id}/status`, { status: confirmModal.newStatus });
      setApplications((prev) => {
        const copy = [...prev];
        copy[confirmModal.appIndex!].status = confirmModal.newStatus;
        copy[confirmModal.appIndex!].updatedAt = new Date().toISOString();
        return copy;
      });
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setConfirmModal({ show: false, appIndex: null, newStatus: "" });
    }
  };

  return (
    <>
    <div className="min-h-screen relative overflow-hidden">
      <style>{`
  @keyframes gradient-x {0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
  @keyframes gradient-x-reverse {0%,100%{background-position:100% 50%;}50%{background-position:0% 50%;}}
  @keyframes gradient-y {0%,100%{background-position:50% 100%;}50%{background-position:50% 0%;}}
  .animate-x {background:linear-gradient(90deg,#ff0000,#ff8c00,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff);background-size:400% 400%;animation:gradient-x 6s linear infinite;}
  .animate-x-reverse {background:linear-gradient(90deg,#ff00ff,#0000ff,#00ffff,#00ff00,#ffff00,#ff8c00,#ff0000);background-size:400% 400%;animation:gradient-x-reverse 6s linear infinite;}
  .animate-y {background:linear-gradient(to top,#ff0000,#ff8c00,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff);background-size:400% 400%;animation:gradient-y 5s linear infinite;}
`}</style>

      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-600 animate-x-reverse"></div>
      <div className="absolute inset-0 bg-white/85 backdrop-blur-md"></div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-3 mb-6 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-1/2 bg-white rounded-xl px-3 py-2 shadow">
            <Search className="text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search by gig category, student, or date..."
              className="w-full bg-transparent outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <select
              className="p-2 rounded-lg border border-gray-300 bg-white shadow"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="p-2 rounded-lg border border-gray-300 bg-white shadow"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="latest">Sort by Latest</option>
              <option value="oldest">Sort by Oldest</option>
              <option value="rate-high">Rate: High → Low</option>
              <option value="rate-low">Rate: Low → High</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading applications...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : applications.length === 0 ? (
          <p className="text-center text-gray-600">No applications found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {applications.map((app, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 180 }}
                className="relative rounded-2xl shadow-lg overflow-hidden border border-gray-200 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-indigo-400 to-purple-400 opacity-30 animate-x"></div>
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

                <div className="p-5 relative z-10">
                  <div className="flex justify-center mb-4">
                    <img
                      src={app.resume?.optimized || app.resume?.original}
                      alt="Resume"
                      className="h-40 rounded-xl object-cover shadow-md border"
                    />
                  </div>

                  <div className="text-center mb-3">
                    <p className="text-sm text-gray-500">Student ID: {app.student?._id}</p>
                    <p className="font-semibold text-lg">{app.student?.name}</p>
                    <p className="text-gray-600">{app.student?.email}</p>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => toggleExpand(index)}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
                    >
                      {expanded.includes(index) ? (
                        <>Hide Details <ChevronUp size={18} className="inline ml-1" /></>
                      ) : (
                        <>View Details <ChevronDown size={18} className="inline ml-1" /></>
                      )}
                    </button>
                  </div>

                  <AnimatePresence>
                    {expanded.includes(index) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-4 rounded-xl p-4 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-200 via-pink-200 to-blue-200 opacity-40 animate-y"></div>
                        <div className="relative z-10 space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800"> Gig Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 text-gray-700">
                            <p><span className="font-medium">Gig ID:</span> {app.gig?._id}</p>
                            <p><span className="font-medium">Title:</span> {app.gig?.title}</p>
                            <p><span className="font-medium">Category:</span> {app.gig?.category}</p>
                            <p><span className="font-medium">Budget:</span> ${app.gig?.budget}</p>
                          </div>

                          <hr className="border-gray-300 my-3" />

                          <h3 className="text-lg font-semibold text-gray-800"> Application Info</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 text-gray-700 gap-y-2">
                            <p><span className="font-medium">ApplicationId:</span> ${app._id}</p>
                            <p><span className="font-medium">Expected Rate:</span> ${app.expectedRate}</p>
                            <p><span className="font-medium">Duration:</span> {app.estimatedDuration}</p>
                            <p>
                              <span className="font-medium">Status:</span>{" "}
                              <span
                                className={`px-2 py-1 rounded-md text-white transition-colors duration-300 ${app.status === "pending"
                                  ? "bg-yellow-500"
                                  : app.status === "accepted"
                                    ? "bg-green-500"
                                    : app.status === "rejected"
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                                  }`}
                              >
                                {app.status}
                              </span>
                            </p>
                            <p><span className="font-medium">Applied At:</span> {new Date(app.appliedAt).toLocaleString()}</p>
                            <p><span className="font-medium">Created:</span> {new Date(app.createdAt).toLocaleString()}</p>
                            <p><span className="font-medium">Updated:</span> {new Date(app.updatedAt).toLocaleString()}</p>
                          </div>


                          <div className="flex justify-center mt-4 gap-2">
                            {app.status !== "PAID" && (
                              <select
                                className="p-2 rounded-lg border border-gray-300 shadow font-medium"
                                value={app.status}
                                onChange={(e) =>
                                  setConfirmModal({ show: true, appIndex: index, newStatus: e.target.value })
                                }
                                disabled={app.status === "completed"}
                              >
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                                <option value="completed">Completed</option>
                              </select>
                            )}
                          </div>


                          {app.status === "completed" && (
                            <>
                              <div className="flex justify-center mt-4">
                                <button
                                  onClick={() =>
                                    navigate("/employer/initiatePayment", {
                                      state: {
                                        gigId: app.gig?._id,
                                        applicationId: app._id,
                                      },
                                    })
                                  }
                                  className="bg-gradient-to-r from-indigo-500 to-purple-500 cursor-pointer text-white font-medium px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
                                >
                                  Pay via Khalti
                                </button>
                              </div>
                            </>
                          )}
                          {app.status === "PAID" && (
                            <>
                              <div className="flex justify-center mt-4">
                                <button
                                  onClick={() =>
                                    navigate("/employer/review/employerGive", {
                                      state: {
                                        applicationId: app._id,
                                      },
                                    })
                                  }
                                  className="bg-yellow-400 cursor-pointer text-white font-medium px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
                                >
                                  Review
                                </button>
                              </div>
                            </>
                          )}


                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}


        {!loading && applications.length > 0 && (
          <div className="flex justify-center mt-8 gap-4 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg font-medium shadow ${page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white shadow rounded-lg">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg font-medium shadow ${page === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 flex flex-col gap-4 shadow-lg">
            <p className="text-gray-800 font-medium text-center">Are you sure you want to update status to <span className="font-bold">{confirmModal.newStatus}</span>?</p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setConfirmModal({ show: false, appIndex: null, newStatus: "" })}
                className="w-1/2 bg-gray-300 rounded-lg py-2 font-medium hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="w-1/2 bg-indigo-500 text-white rounded-lg py-2 font-medium hover:bg-indigo-600 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div> 
    </>
  );
};

export default EmployerApplicationsPage;
