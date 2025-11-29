// ApplicationsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import axiosConfig from "../../config/axios.config";
import { useNavigate } from "react-router";

type Application = {
  resume: { optimized: string; original?: string };
  _id: string;
  student?: string;
  gig: {
    _id: string;
    title?: string;
    category?: string;
    budget?: number;
    employer?: string;
  };
  proposalMessage?: string;
  expectedRate?: number;
  coverLetter?: string;
  estimatedDuration?: string;
  status?: string;
  employerRead?: boolean;
  studentRead?: boolean;
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

const PAGE_SIZE = 6;

const ApplicationsPage = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchCategory, setSearchCategory] = useState("");
  const [filterGig, setFilterGig] = useState<string>("all");
  const [filterAppliedDate, setFilterAppliedDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false);
  const [appToDelete, setAppToDelete] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosConfig.get("/application/student/me", {
        params: {
          search: searchCategory || undefined,
          gigId: filterGig !== "all" ? filterGig : undefined,
          appliedAt: filterAppliedDate || undefined,
          page,
          limit: PAGE_SIZE,
        },
      });

      const appsData = res.data.applications ?? [];
      setApps(appsData);
      setTotalPages(res.data.meta?.totalPages ?? 1);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch applications");
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, filterGig, filterAppliedDate]);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const t = window.setTimeout(() => {
      setPage(1);
      fetchApplications();
    }, 700);
    setDebounceTimer(t);
    return () => clearTimeout(t);
  }, [searchCategory]);

  const gigOptions = useMemo(() => {
    if (!apps || apps.length === 0) return [{ id: "all", title: "All gigs" }];
    const uniqueGigs = apps
      .map((a) => a.gig)
      .filter((g): g is { _id: string; title?: string } => !!g && !!g._id)
      .reduce((acc, gig) => {
        if (!acc.some((item) => item.id === gig._id)) {
          acc.push({ id: gig._id, title: gig.title || "Untitled Gig" });
        }
        return acc;
      }, [] as { id: string; title: string }[]);
    return [{ id: "all", title: "All gigs" }, ...uniqueGigs];
  }, [apps]);

  useEffect(() => {
    if (filterGig !== "all" && !apps.some((a) => a.gig?._id === filterGig)) {
      setFilterGig("all");
    }
  }, [apps, filterGig]);

  const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "-");

  const handleDelete = async (appId: string) => {
    try {
      const res = await axiosConfig.delete(`/application/${appId}`);
      toast.success("Application deleted successfully!");
      setApps((prev) => prev.filter((a) => a._id !== appId));
      setShowConfirm(false);
      setAppToDelete(null);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete application");
    }
  };

  const pageStyle: React.CSSProperties = {
    background:
      "linear-gradient(-45deg, #ff9a9e, #fad0c4, #a1c4fd, #c2e9fb)",
    backgroundSize: "400% 400%",
    animation: "bgMove 12s ease infinite",
  };

  return (
    <>
      <div className="min-h-screen p-6" style={pageStyle}>
        <style>{`
        @keyframes bgMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .glow-card {
          position: relative;
          border-radius: 1rem;
          overflow: visible;
        }
        .glow-card::before {
          content: "";
          position: absolute;
          inset: -2px;
          z-index: -1;
          border-radius: 1rem;
          background: linear-gradient(90deg, rgba(99,102,241,0.9), rgba(236,72,153,0.9), rgba(59,130,246,0.9));
          filter: blur(6px);
          opacity: 0.6;
          animation: glowPulse 3s ease-in-out infinite;
        }
        .card-inner {
          border-radius: 1rem;
          background: white;
          position: relative;
          z-index: 1;
        }
        @keyframes glowPulse {
          0% { transform: scale(1); opacity: 0.5; filter: blur(4px); }
          50% { transform: scale(1.03); opacity: 1; filter: blur(6px); }
          100% { transform: scale(1); opacity: 0.5; filter: blur(4px); }
        }
      `}</style>

        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            Student Applications
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
            <div className="flex-1 mb-6">
              <input
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                placeholder="Search by gig category"
                className="w-full px-4 py-2 rounded-lg shadow-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="w-full md:w-64 mb-6">
              <select
                value={filterGig}
                onChange={(e) => {
                  setFilterGig(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 rounded-lg shadow-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {gigOptions.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-48 mb-6">
              <input
                type="date"
                value={filterAppliedDate}
                onChange={(e) => {
                  setFilterAppliedDate(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 rounded-lg shadow-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex-shrink-0 mb-6">
              <button
                onClick={() => {
                  setSearchCategory("");
                  setFilterGig("all");
                  setFilterAppliedDate("");
                  setPage(1);
                }}
                className="px-4 py-2 bg-white/90 rounded-lg shadow hover:shadow-md"
              >
                Clear
              </button>
            </div>
          </div>

          {loading && <div className="text-center text-white mb-4">Loading…</div>}
          {error && (
            <div className="text-center text-red-800 bg-red-200 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.length === 0 && !loading && (
              <div className="col-span-full text-center text-white">
                No applications found.
              </div>
            )}

            <AnimatePresence>
              {apps.map((app, index) => {
                const isOpen = expandedIndex === index;
                return (
                  <motion.div
                    key={app._id}
                    layout
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="glow-card"
                  >
                    <div className="card-inner p-5 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 transition-all duration-300">
                      <div className="flex justify-center -mt-12 mb-3">
                        <img
                          src={app.resume.optimized}
                          alt="resume"
                          className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
                        />
                      </div>

                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Category:</span>{" "}
                          {app.gig?.category ?? "-"} •{" "}
                          <span className="font-semibold">Budget:</span>{" "}
                          ${app.gig?.budget ?? "-"}
                        </p>

                        <p className="mt-2 text-gray-800">
                          <span className="font-semibold">Expected Rate:</span>{" "}
                          ${app.expectedRate ?? "-"}
                        </p>

                        <p className="text-gray-600 mt-1">
                          <span className="font-semibold">Employer Read:</span>{" "}
                          {app.employerRead ? "Yes" : "No"}
                        </p>

                        <p className="text-gray-600 mt-1">
                          <span className="font-semibold">Status:</span>{" "}
                          <span
                            className={`px-2 py-0.5 rounded text-white text-xs ${app.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              }`}
                          >
                            {app.status ?? "-"}
                          </span>
                        </p>

                        <div className="mt-2 text-xs text-gray-500">
                          <div>
                            <strong>Applied At:</strong> {fmt(app.appliedAt)}
                          </div>
                          <div>
                            <strong>Created At:</strong> {fmt(app.createdAt)}
                          </div>
                          <div>
                            <strong>Updated At:</strong> {fmt(app.updatedAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4">
                        <button
                          onClick={() => setExpandedIndex(isOpen ? null : index)}
                          className="px-4 py-1 rounded-md text-white bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-95 shadow transition text-sm"
                        >
                          {isOpen ? "Hide Details" : "View Details"}
                        </button>

                        {app.status === "PAID" && (
                          <button
                            onClick={() =>
                              navigate("/student/review/studentGiveReview", {
                                state: {
                                  applicationId: app._id,
                                },
                              })
                            }
                            className="px-4 py-1 rounded-md bg-yellow-400 text-white font-medium shadow hover:opacity-90 transition text-sm"
                          >
                            Review
                          </button>
                        )}
                      </div>


                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="mt-4 overflow-hidden"
                          >
                            <div className="border-t pt-3 text-sm text-gray-700">
                              <div className="mb-2">
                                <strong>— Gig Details —</strong>
                                <div className="text-xs mt-1 text-gray-600">
                                  <div>ID: {app.gig?._id}</div>
                                  <div>Title: {app.gig?.title}</div>
                                  <div>Category: {app.gig?.category}</div>
                                  <div>Budget: ${app.gig?.budget}</div>
                                  <div>Employer: {app.gig?.employer}</div>
                                </div>
                              </div>

                              <div>
                                <strong>— Application Info —</strong>
                                <div className="text-xs mt-1 text-gray-600 space-y-1">
                                  <div>
                                    <strong>Proposal Message:</strong>{" "}
                                    {app.proposalMessage ?? "-"}
                                  </div>
                                  <div>
                                    <strong>Expected Rate:</strong> $
                                    {app.expectedRate ?? "-"}
                                  </div>
                                  <div>
                                    <strong>Estimated Duration:</strong>{" "}
                                    {app.estimatedDuration ?? "-"}
                                  </div>
                                  <div>
                                    <strong>Status:</strong> {app.status ?? "-"}
                                  </div>
                                  <div>
                                    <strong>Employer Read:</strong>{" "}
                                    {app.employerRead ? "Yes" : "No"}
                                  </div>
                                  <div>
                                    <strong>Applied At:</strong>{" "}
                                    {fmt(app.appliedAt)}
                                  </div>
                                  <div>
                                    <strong>Created At:</strong>{" "}
                                    {fmt(app.createdAt)}
                                  </div>
                                  <div>
                                    <strong>Updated At:</strong>{" "}
                                    {fmt(app.updatedAt)}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 flex justify-center">
                                {!(app.status === "completed" || app.status === "PAID") && (
                                  <button
                                    onClick={() => {
                                      setAppToDelete(app._id);
                                      setShowConfirm(true);
                                    }}
                                    className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-red-500 to-pink-500 shadow hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                                  >
                                    Delete Application
                                  </button>
                                )}
                              </div>


                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="text-white">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-2 rounded bg-white/90"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`px-3 py-2 rounded ${page === n ? "bg-indigo-600 text-white" : "bg-white/90"
                      }`}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                className="px-3 py-2 rounded bg-white/90"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showConfirm && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Are you sure you want to delete this application?
                </h2>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      if (appToDelete) handleDelete(appToDelete);
                    }}
                    className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg transition-all"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      setAppToDelete(null);
                    }}
                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ApplicationsPage;
