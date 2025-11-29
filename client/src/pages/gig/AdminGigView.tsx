import React, { useEffect, useState, useMemo } from "react";
import axiosConfig from "../../config/axios.config"; // <-- IMPORTANT: update import path if needed

import {
  Search as IconSearch,
  Filter as IconFilter,
  DollarSign as IconDollar,
  Clock as IconClock,
  User as IconUser,
  Layers as IconLayers,
  Loader2 as IconLoader,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Edit2 as IconEdit,
  Trash2 as IconTrash,
  RotateCw as IconRestore,
  X as IconX,
  Plus as IconPlus,
} from "lucide-react";

interface Gig {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  duration: string;
  requiredSkills: string[];
  employer: { name: string; email: string } | null;
  status: string;
  applicationsCount: number;
  createdAt: string;
  isDeleted?: boolean;
}

interface Palette {
  bg: string;
  hoverBg: string;
  text: string;
  accent: string;
}

const CARD_PALETTES: Palette[] = [
  {
    bg: "bg-blue-50",
    hoverBg: "hover:bg-blue-100",
    text: "text-blue-800",
    accent: "text-blue-700",
  },
  {
    bg: "bg-purple-50",
    hoverBg: "hover:bg-purple-100",
    text: "text-purple-800",
    accent: "text-purple-700",
  },
  {
    bg: "bg-teal-50",
    hoverBg: "hover:bg-teal-100",
    text: "text-teal-800",
    accent: "text-teal-700",
  },
  {
    bg: "bg-indigo-50",
    hoverBg: "hover:bg-indigo-100",
    text: "text-indigo-800",
    accent: "text-indigo-700",
  },
];

const Tag: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: "green" | "red" | "default";
}> = ({ children, className = "", color = "default" }) => {
  let colorClasses = "bg-gray-200 text-gray-800";

  if (color === "green") {
    colorClasses = "bg-green-600 text-white font-bold";
  } else if (color === "red") {
    colorClasses = "bg-red-500 text-white font-bold";
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
};

const AdminGigs: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [minBudget, setMinBudget] = useState<string>("");
  const [maxBudget, setMaxBudget] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [editingGigId, setEditingGigId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [confirmState, setConfirmState] = useState<{
    gigId: string | null;
    type: "UPDATE" | "DELETE" | "RESTORE" | null;
    reason?: string;
    visible: boolean;
  }>({ gigId: null, type: null, reason: "", visible: false });

  const buildParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: searchQuery || undefined,
      category: categoryFilter || undefined,
      minBudget: minBudget || undefined,
      maxBudget: maxBudget || undefined,
    }),
    [currentPage, pageSize, searchQuery, categoryFilter, minBudget, maxBudget]
  );

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const res = await axiosConfig.get("/gig/admin/all", {
        params: buildParams,
      });

      setGigs(res.data?.data?.gigs ?? []);
      setTotal(res.data?.data?.pagination?.total ?? 0);
    } catch (err) {
      setGigs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, [currentPage, pageSize, searchQuery, categoryFilter, minBudget, maxBudget]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, minBudget, maxBudget]);

  const paletteForIndex = (i: number) => CARD_PALETTES[i % CARD_PALETTES.length];

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startRange = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, total);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const PageButton: React.FC<{
    page: number;
    children: React.ReactNode;
  }> = ({ page, children }) => (
    <button
      onClick={() => handlePageChange(page)}
      disabled={page < 1 || page > totalPages}
      className={`p-2 rounded-full w-8 h-8 flex items-center justify-center transition ${page === currentPage
          ? "bg-blue-600 text-white font-semibold shadow-md"
          : "bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        }`}
    >
      {children}
    </button>
  );

  const openEdit = (gig: Gig) => {
    setEditingGigId(gig._id);
    setEditForm({
      title: gig.title ?? "",
      description: gig.description ?? "",
      category: gig.category ?? "",
      budget: gig.budget ?? 0,
      duration: gig.duration ?? "",
      requiredSkills: Array.isArray(gig.requiredSkills) ? [...gig.requiredSkills] : [],
      status: (gig.status ?? "inactive").toString().toLowerCase(),
      isDeleted: !!gig.isDeleted,
    });
    setConfirmState({ gigId: null, type: null, reason: "", visible: false });
  };

  const closeEdit = () => {
    setEditingGigId(null);
    setEditForm({});
    setConfirmState({ gigId: null, type: null, reason: "", visible: false });
  };

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (!s) return;
    setEditForm((prev: any) => {
      const nextSkills = [...(prev.requiredSkills || [])];
      if (!nextSkills.includes(s)) nextSkills.push(s);
      return { ...prev, requiredSkills: nextSkills };
    });
  };

  const removeSkill = (skill: string) => {
    setEditForm((prev: any) => ({
      ...prev,
      requiredSkills: (prev.requiredSkills || []).filter((s: string) => s !== skill),
    }));
  };

  const submitUpdate = async (gigId: string) => {
    try {
      const updateFields: any = {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        budget: Number(editForm.budget) || 0,
        duration: editForm.duration,
        requiredSkills: editForm.requiredSkills || [],
        status: editForm.status,
        isDeleted: !!editForm.isDeleted,
      };

      await axiosConfig.put(`/gig/admin/edit/${gigId}`, updateFields);

      await fetchGigs();
      closeEdit();
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed. Check console for details.");
    }
  };

  const submitAction = async (gigId: string, type: "DELETE" | "RESTORE") => {
    try {
      await axiosConfig.put(`/gig/admin/edit/${gigId}`, {
        action: type,
        reason: confirmState.reason || undefined,
      });

      await fetchGigs();
      if (editingGigId === gigId) closeEdit();
      setConfirmState({ gigId: null, type: null, reason: "", visible: false });
    } catch (err) {
      console.error(`${type} failed`, err);
      alert(`${type} failed. Check console.`);
    }
  };

  const handleConfirmYes = async () => {
    const gigId = confirmState.gigId;
    const type = confirmState.type;
    if (!gigId || !type) return;

    if (type === "UPDATE") {
      await submitUpdate(gigId);
    } else if (type === "DELETE" || type === "RESTORE") {
      await submitAction(gigId, type);
    }

    setConfirmState({ gigId: null, type: null, reason: "", visible: false });
  };

  const handleConfirmNo = () => {
    setConfirmState({ gigId: null, type: null, reason: "", visible: false });
  };

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString() : "—";

  return (
    <>
      <div className="w-full min-h-screen p-4 md:p-8 bg-gray-50">

        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-blue-800 tracking-tight">
            Admin Gig Management
          </h1>

          <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Search Gigs
                </label>
                <div className="relative">
                  <IconSearch className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Title or description..."
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500 pr-10 transition"
                  >
                    <option value="">All Categories</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                  </select>
                  <IconFilter className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Min Budget
                </label>
                <div className="relative">
                  <IconDollar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    placeholder="0"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Max Budget
                </label>
                <div className="relative">
                  <IconDollar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="No limit"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-600">
                Showing {total === 0 ? 0 : startRange}-{endRange} of {total} gigs
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">Items per page:</div>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg text-sm transition"
                >
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </div>

          <div className="relative min-h-[400px]">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
                <IconLoader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            )}


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {gigs.length > 0 ? (
                gigs.map((gig, idx) => {
                  const p = paletteForIndex(idx);
                  const isEditing = editingGigId === gig._id;
                  const statusUpper = (gig.status || "").toString().toUpperCase();

                  return (
                    <div
                      key={gig._id}
                      className={`
                      relative p-5 rounded-xl border border-gray-200 shadow-lg 
                      transition-all duration-300 transform-gpu
                      ${p.bg} ${p.hoverBg} hover:shadow-2xl hover:-translate-y-1
                    `}
                    >
                      <button
                        title="Edit gig"
                        onClick={() => openEdit(gig)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white shadow text-gray-600 hover:bg-gray-100 transition transform hover:scale-105"
                      >
                        <IconEdit className="w-4 h-4" />
                      </button>

                      <div className="flex flex-col justify-between h-full">
                        <div className="space-y-3">
                          <h3 className={`text-xl font-bold ${p.text} line-clamp-2`}>
                            {gig.title}
                          </h3>

                          <p className="text-sm text-gray-700 line-clamp-3">
                            {gig.description}
                          </p>

                          <div className="space-y-2 pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <IconLayers className={`w-4 h-4 ${p.accent}`} />
                              <span className={`text-sm font-medium ${p.accent}`}>
                                {gig.category}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <IconDollar className={`w-4 h-4 ${p.accent}`} />
                                <span className={`text-sm font-bold ${p.accent}`}>
                                  ${gig.budget.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <IconClock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{gig.duration}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <IconUser className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                {gig.employer?.name ?? "Unknown Employer"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-start gap-2 pt-3 border-t border-gray-200">
                            <strong className="text-sm text-gray-700 w-full mb-1">
                              Required Skills:
                            </strong>
                            {gig.requiredSkills?.map((s) => (
                              <span
                                key={s}
                                className="inline-flex items-center rounded-lg px-3 py-0.5 text-xs bg-red-700 text-white font-semibold"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          {isEditing ? (
                            <div
                              className="space-y-3 animate-fadeIn"
                              style={{ animationDuration: "180ms" }}
                            >
                              <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="w-full p-2 border rounded"
                                placeholder="Title"
                              />
                              <textarea
                                value={editForm.description}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, description: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                placeholder="Description"
                              />

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <select
                                  value={editForm.category}
                                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                  className="w-full p-2 border rounded"
                                >
                                  <option value="">Select category</option>
                                  <option value="Web Development">Web Development</option>
                                  <option value="Marketing">Marketing</option>
                                  <option value="Design">Design</option>
                                </select>

                                <input
                                  type="number"
                                  value={editForm.budget}
                                  onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                                  className="w-full p-2 border rounded"
                                  placeholder="Budget"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={editForm.duration}
                                  onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                                  className="w-full p-2 border rounded"
                                  placeholder="Duration"
                                />

                                <select
                                  value={editForm.status}
                                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                  className="w-full p-2 border rounded"
                                >
                                  <option value="active">ACTIVE</option>
                                  <option value="inactive">INACTIVE</option>
                                  <option value="inactive">PAUSE</option>
                                  <option value="active">UNPAUSE</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                  Deletion State
                                </label>
                                <select
                                  value={editForm.isDeleted ? "DELETE" : "RESTORE"}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      isDeleted: e.target.value === "DELETE",
                                    })
                                  }
                                  className="w-full p-2 border rounded"
                                >
                                  <option value="true">DELETE</option>
                                  <option value="false">RESTORE</option>
                                </select>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <input
                                    type="text"
                                    placeholder="Add skill and press Enter"
                                    className="flex-1 p-2 border rounded"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        addSkill((e.target as HTMLInputElement).value);
                                        (e.target as HTMLInputElement).value = "";
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="px-3 py-2 bg-gray-200 rounded"
                                    onClick={(ev) => {
                                      const input = (ev.currentTarget.previousElementSibling as HTMLInputElement);
                                      if (!input) return;
                                      addSkill(input.value);
                                      input.value = "";
                                    }}
                                  >
                                    <IconPlus className="w-4 h-4" />
                                  </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {(editForm.requiredSkills || []).map((s: string) => (
                                    <span
                                      key={s}
                                      className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                                    >
                                      <span>{s}</span>
                                      <button
                                        onClick={() => removeSkill(s)}
                                        className="p-1 rounded-full hover:bg-gray-200"
                                        title="Remove skill"
                                      >
                                        <IconX className="w-3 h-3" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:opacity-95 transition"
                                  onClick={() =>
                                    setConfirmState({ gigId: gig._id, type: "UPDATE", visible: true })
                                  }
                                >
                                  Update
                                </button>

                                {!gig.isDeleted ? (
                                  <button
                                    className="px-3 py-2 bg-red-600 text-white rounded flex items-center gap-2"
                                    onClick={() =>
                                      setConfirmState({ gigId: gig._id, type: "DELETE", visible: true })
                                    }
                                  >
                                    <IconTrash className="w-4 h-4" />
                                    Delete
                                  </button>
                                ) : (
                                  <button
                                    className="px-3 py-2 bg-yellow-600 text-white rounded flex items-center gap-2"
                                    onClick={() =>
                                      setConfirmState({ gigId: gig._id, type: "RESTORE", visible: true })
                                    }
                                  >
                                    <IconRestore className="w-4 h-4" />
                                    Restore
                                  </button>
                                )}

                                <button
                                  className="px-3 py-2 border rounded"
                                  onClick={() => closeEdit()}
                                  title="Cancel edit"
                                >
                                  Cancel
                                </button>
                              </div>

                              {confirmState.visible && confirmState.gigId === gig._id && (
                                <div
                                  className="mt-3 p-3 bg-white border rounded shadow-md w-full max-w-sm animate-scaleIn"
                                  style={{ zIndex: 40 }}
                                >
                                  <p className="text-sm font-medium mb-2">
                                    {confirmState.type === "UPDATE"
                                      ? "Are you sure you want to update this gig?"
                                      : confirmState.type === "DELETE"
                                        ? "Are you sure you want to delete this gig?"
                                        : "Are you sure you want to restore this gig?"}
                                  </p>

                                  <input
                                    type="text"
                                    placeholder="(optional) reason"
                                    value={confirmState.reason}
                                    onChange={(e) =>
                                      setConfirmState((s) => ({ ...s, reason: e.target.value }))
                                    }
                                    className="w-full p-2 border rounded mb-2"
                                  />

                                  <div className="flex gap-2">
                                    <button
                                      onClick={handleConfirmYes}
                                      className="flex-1 px-3 py-1 bg-green-600 text-white rounded"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      onClick={handleConfirmNo}
                                      className="flex-1 px-3 py-1 bg-gray-300 rounded"
                                    >
                                      No
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <Tag color={statusUpper === "active" ? "green" : "red"}>
                                {statusUpper || "inactive"}
                              </Tag>

                              <div className="ml-auto text-xs text-gray-400 flex flex-col items-end">
                                <strong className="font-medium text-gray-500">Created</strong>
                                <span className="mt-0.5">{formatDate(gig.createdAt)}</span>
                              </div>

                              <button
                                className="ml-3 px-3 py-1 bg-blue-600 text-white rounded text-xs"
                                onClick={() => openEdit(gig)}
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                !loading && (
                  <div className="col-span-full text-center py-16 text-xl text-gray-600 bg-white rounded-xl shadow-inner">
                    No gigs match your current filters.
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center items-center gap-2 sm:gap-4 md:gap-6">
            <PageButton page={1} >
              <ChevronsLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </PageButton>

            <PageButton page={Math.max(1, currentPage - 1)}>
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </PageButton>

            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-3">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                const isNearCurrent =
                  page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;

                if (isNearCurrent) {
                  return (
                    <PageButton
                      key={page}
                      page={page}
                      
                    >
                      {page}
                    </PageButton>
                  );
                } else if (Math.abs(page - currentPage) === 2) {
                  return (
                    <span key={page} className="text-gray-500 self-end mb-1 text-sm sm:text-base md:text-base">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <PageButton page={Math.min(totalPages, currentPage + 1)}>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </PageButton>

            <PageButton page={totalPages} >
              <ChevronsRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </PageButton>
          </div>

        </div>

        <style>{`
        @keyframes scaleIn {
          from { transform: scale(.98); opacity: 0 }
          to { transform: scale(1); opacity: 1 }
        }
        .animate-scaleIn { animation: scaleIn 160ms ease-out both; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px) }
          to { opacity: 1; transform: translateY(0) }
        }
        .animate-fadeIn { animation: fadeIn 160ms ease-out both; }
      `}</style>
      </div>
    </>
  );
};

export default AdminGigs;
