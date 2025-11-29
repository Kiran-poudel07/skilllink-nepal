import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import axiosConfig from "../../config/axios.config";

const gradientParent = "linear-gradient(90deg, #ffd1dc, #ffb3c6, #ffc9e3, #ffe0f0)";

const gradientCardTop = "linear-gradient(90deg, #a0f0e0, #b3d1ff, #c8b3ff, #e0d6ff)";
// const gradientCardTop = "linear-gradient(90deg, #ffe5b4, #d4ffb4, #b4ffe0, #c1ffd6)";
// const gradientCardTop = "linear-gradient(90deg, #d8c1ff, #c1e0ff, #b3f0ff, #cce7ff)";


const gradientExpanded = "linear-gradient(to bottom, #ffd8cc, #ffe0b3, #fff0c1, #d6f0ff)"

const AdminApplicationsPage = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<number[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const toggleExpand = (index: number) => {
        setExpanded((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axiosConfig.get("/application/all", {
                params: { page, limit: 6, search, status },
            });
            setApplications(res.data.data ?? []);
            setTotalPages(res.data.pagination?.totalPages ?? 1);
        } catch (err) {
            console.error(err);
            setError("Failed to load applications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [page, search, status]);

    const getColumns = (items: any[], cols = 3) => {
        const columns: any[][] = Array.from({ length: cols }, () => []);
        items.forEach((item, idx) => {
            columns[idx % cols].push({ ...item, idx });
        });
        return columns;
    };

    const columns = getColumns(applications, 3);

    return (
        <>
            <div
            className="min-h-screen p-6"
            style={{ background: gradientParent, backgroundSize: "400% 400%", animation: "gradientBG 15s ease infinite" }}
        >
            <style>
                {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
            </style>

            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-700">All Applications</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mb-6 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-1/2 bg-white rounded-xl px-3 py-2 shadow">
                    <Search className="text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by student name, email or gig title..."
                        className="w-full bg-transparent outline-none"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

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
            </div>

            {loading ? (
                <p className="text-center text-gray-600">Loading applications...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : applications.length === 0 ? (
                <p className="text-center text-gray-600">No applications found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {columns.map((column, colIdx) => (
                        <div key={colIdx} className="flex flex-col gap-6">
                            {column.map((app: any) => {
                                const index = app.idx;
                                return (
                                    <motion.div
                                        key={index}
                                        layout
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 180 }}
                                        className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden"
                                    >
                                        <div
                                            className="p-4 rounded-t-2xl"
                                            style={{ background: gradientCardTop }}
                                        >
                                            <div className="flex justify-center mb-3">
                                                <img
                                                    src={app.student.image.optimizedUrl}
                                                    alt={app.student.name}
                                                    className="h-36 w-36 rounded-full object-cover border-2 border-indigo-400 shadow-md"
                                                />
                                            </div>
                                            <div className="text-center mb-4 text-white">
                                                <p className="text-sm">ID: {app.student._id}</p>
                                                <p className="text-lg font-semibold">{app.student.name}</p>
                                                <p>{app.student.email}</p>
                                                <p className="text-sm">
                                                    Status:{" "}
                                                    <span
                                                        className={`px-2 py-1 rounded-md text-white ${app.student.status === "active" ? "bg-green-500" : "bg-red-500"
                                                            }`}
                                                    >
                                                        {app.student.status}
                                                    </span>
                                                </p>
                                                <p className="text-sm">Blocked: {app.student.isBlocked ? "Yes" : "No"}</p>
                                                <p className="text-sm">Deleted: {app.student.isDeleted ? "Yes" : "No"}</p>
                                            </div>
                                            <div className="text-center mb-2">
                                                <button
                                                    onClick={() => toggleExpand(index)}
                                                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 transition"
                                                >
                                                    {expanded.includes(index) ? (
                                                        <><ChevronUp size={18} className="inline ml-1" /> Hide Details</>
                                                    ) : (
                                                        <><ChevronDown size={18} className="inline ml-1" /> View Details</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {expanded.includes(index) && (
                                                <motion.div
                                                    layout
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="p-4 border border-gray-200 rounded-b-xl"
                                                    style={{ background: gradientExpanded }}
                                                >
                                                    <h3 className="font-semibold text-gray-700 mb-2"> Gig Details</h3>
                                                    <div className="text-gray-700 mb-3 space-y-1">

                                                        <p>Title: {app.gig.title}</p>
                                                        <p>Category: {app.gig.category}</p>
                                                        <p>Budget: ${app.gig.budget}</p>
                                                        <p>Duration: {app.gig.duration}</p>
                                                        <p>Required Skills: {app.gig.requiredSkills.join(", ")}</p>
                                                        <p>Employer ID: {app.gig.employer}</p>
                                                        <p>Status: {app.gig.status}</p>
                                                        <p>Applications Count: {app.gig.applicationsCount}</p>
                                                        <p>Deleted: {app.gig.isDeleted ? "Yes" : "No"}</p>
                                                        <p>Created At: {new Date(app.gig.createdAt).toLocaleString()}</p>
                                                        <p>Updated At: {new Date(app.gig.updatedAt).toLocaleString()}</p>
                                                    </div>
                                                    <h3 className="font-semibold text-gray-700 mb-2"> Application Info</h3>
                                                    <div className="text-gray-700 space-y-1">

                                                        <p>Estimated Duration: {app.estimatedDuration}</p>
                                                        <p>Status: {app.status}</p>
                                                        <p>Employer Read: {app.employerRead ? "Yes" : "No"}</p>
                                                        <p>Student Read: {app.studentRead ? "Yes" : "No"}</p>
                                                        <p>Applied At: {new Date(app.appliedAt).toLocaleString()}</p>
                                                        <p>Created At: {new Date(app.createdAt).toLocaleString()}</p>
                                                        <p>Updated At: {new Date(app.updatedAt).toLocaleString()}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

            {!loading && applications.length > 0 && (
                <div className="flex justify-center mt-8 gap-4 flex-wrap">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-lg font-medium shadow ${page === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-500 text-white hover:bg-indigo-600"
                            }`}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 bg-white shadow rounded-lg">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-lg font-medium shadow ${page === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-500 text-white hover:bg-indigo-600"
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
        </>
    );
};

export default AdminApplicationsPage;
