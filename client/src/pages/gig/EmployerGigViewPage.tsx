import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { type IGigWithStatus } from "../contract/gig.contract";
import axiosConfig from "../../config/axios.config";
import { Link } from "react-router";

const EmployerGigViewPage = () => {
  const [gigs, setGigs] = useState<IGigWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  const [editingGigId, setEditingGigId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    status: "",
    budget: "",
    duration: "",
    requiredSkills: "",
  });

  const [updatedGlowId, setUpdatedGlowId] = useState<string | null>(null);
  const [deletedGigId, setDeletedGigId] = useState<string | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [gigToDelete, setGigToDelete] = useState<string | null>(null);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const response = await axiosConfig.get("/gig/my", {
        params: {
          search: searchTerm || undefined,
          status: statusFilter || undefined,
          category: categoryFilter || undefined,
          page,
          limit: 6,
        },
      });
      setGigs(response.data.gigs || []);
      setTotalPages(response.data.pagination.totalPages || 1);
    } catch (error: any) {
      toast.error("Failed to fetch gigs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, [page, statusFilter, categoryFilter]);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      setPage(1);
      fetchGigs();
    }, 700);
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleEditClick = (gig: IGigWithStatus) => {
    setEditingGigId(gig._id ?? "");
    setEditData({
      title: gig.title,
      description: gig.description || "",
      budget: gig.budget.toString(),
      status: gig.status,
      duration: gig.duration,
      requiredSkills: gig.requiredSkills.join(", "),
    });
  };

  const handleCancelEdit = () => {
    setEditingGigId(null);
    setEditData({
      title: "",
      description: "",
      budget: "",
      status: "",
      duration: "",
      requiredSkills: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (gigId: string) => {
    try {
      const payload = {
        title: editData.title,
        description: editData.description,
        budget: Number(editData.budget),
        status: editData.status,
        duration: editData.duration,
        requiredSkills: editData.requiredSkills.split(",").map((s) => s.trim()),
      };

      await axiosConfig.put(`/gig/${gigId}`, payload);
      toast.success("Gig updated successfully!");

      setGigs((prev) =>
        prev.map((gig) => (gig._id === gigId ? { ...gig, ...payload } : gig))
      );

      setUpdatedGlowId(gigId);
      setTimeout(() => setUpdatedGlowId(null), 2000);

      setEditingGigId(null);
    } catch (error: any) {
      toast.error("Failed to update gig");
    }
  };

  const handleDelete = async () => {
    if (!gigToDelete) return;
    try {
      setDeletedGigId(gigToDelete);
      await new Promise((resolve) => setTimeout(resolve, 300));
      await axiosConfig.delete(`/gig/${gigToDelete}`);
      toast.success("Gig deleted successfully!");
      setGigs((prev) => prev.filter((gig) => gig._id !== gigToDelete));
    } catch (error: any) {
      toast.error("Failed to delete gig");
      setDeletedGigId(null);
    } finally {
      setShowConfirm(false);
      setGigToDelete(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Employer Gigs</h1>

          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              placeholder="Search gigs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              <option value="">All Categories</option>
              <option value="Marketing & Advertising">Marketing & Advertising</option>
              <option value="it">IT</option>
              <option value="Web Development">Web Development</option>
            </select>
            <Link
              to="create"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Add Gig
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center">Loading gigs...</p>
        ) : gigs.length === 0 ? (
          <p className="text-gray-600 text-center">No gigs found</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className={`
                relative overflow-hidden rounded-xl shadow-lg p-6 flex flex-col justify-between group transform transition-all duration-500 
                hover:scale-105 hover:shadow-2xl
                ${updatedGlowId === gig._id ? "border-2 border-green-500 shadow-green-300" : "border border-gray-300"}
                ${deletedGigId === gig._id ? "opacity-0 scale-95" : "opacity-100"}
              `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 opacity-50 animate-gradient-x z-0"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                  {editingGigId === gig._id ? (
                    <>
                      <p className="text-xs text-gray-600 mb-1">
                        <span className="font-medium">Gig ID:</span> {gig._id}
                      </p>
                      <input
                        name="title"
                        value={editData.title}
                        onChange={handleInputChange}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Title"
                      />
                      <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleInputChange}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Description"
                      />
                      <input
                        name="budget"
                        value={editData.budget}
                        onChange={handleInputChange}
                        type="number"
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Budget"
                      />
                      <input
                        name="duration"
                        value={editData.duration}
                        onChange={handleInputChange}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Duration"
                      />
                      <input
                        name="requiredSkills"
                        value={editData.requiredSkills}
                        onChange={handleInputChange}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Required Skills (comma-separated)"
                      />
                      <select
                        name="status"
                        value={editData.status}
                        onChange={handleInputChange}
                        className="w-full mb-2 p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <p className="text-xs text-gray-600 mb-2">
                        <span className="font-medium">Deleted:</span> {gig.isDeleted ? "Yes" : "No"}
                      </p>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleSaveEdit(gig._id ?? "")}
                          className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
                        {gig.title}
                      </h2>
                      <div className="text-gray-700 text-sm space-y-1">
                        <p><span className="font-medium">Gig ID:</span> {gig._id}</p>
                        <p><span className="font-medium">Description:</span> {gig.description}</p>
                        <p><span className="font-medium">Category:</span> {gig.category}</p>
                        <p><span className="font-medium">Budget:</span> ${gig.budget}</p>
                        <p><span className="font-medium">Duration:</span> {gig.duration}</p>
                        <p><span className="font-medium">Skills:</span> {gig.requiredSkills.join(", ")}</p>
                        <p><span className="font-medium">Status:</span> {gig.status}</p>
                        <p><span className="font-medium">Applications:</span> {gig.applicationsCount}</p>
                        <p><span className="font-medium">Deleted:</span> {gig.isDeleted ? "Yes" : "No"}</p>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleEditClick(gig)}
                          className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => {
                            setGigToDelete(gig._id ?? "");
                            setShowConfirm(true);
                          }}
                          className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${page === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this gig?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <style>
          {`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 6s ease infinite;
          }
        `}
        </style>
      </div>
    </>
  );
};

export default EmployerGigViewPage;
