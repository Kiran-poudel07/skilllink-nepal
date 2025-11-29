import { useEffect, useState, type ChangeEvent } from "react";
import axiosConfig from "../../config/axios.config";

type User = {
  _id: string;
  name: string;
  email: string;
  age?: string;
  dob?: string | null;
  gender?: string | null;
  role?: string | null;
  image?: { url?: string; optimizedUrl?: string } | null;
  status?: string | null;
  isBlocked?: boolean | null;
  isDeleted?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

const USERS_LIST_URL = "/users/admin/all/userlist";
const ADMIN_ACTION_URL = "/users/admin/action";
const UPDATE_USER_URL = (id: string) => `/users/admin/${id}`;
const DELETE_USER_URL = (id: string) => `/users/admin/${id}`;

const safeSliceDate = (d?: string | null) => (d ? d.slice(0, 10) : "");

const UsersPage = () => {
  const [view, setView] = useState<"table" | "grid">("table");
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [blocked, setBlocked] = useState("");
  const [deleted, setDeleted] = useState("");
  const [page, setPage] = useState(1);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    email: string;
    age?: string;
    dob?: string;
    gender?: string;
    role?: string;
    status?: string;
    isBlocked?: boolean | null;
    isDeleted?: boolean | null;
    image: File | null;
  }>({
    name: "",
    email: "",
    age: "",
    dob: "",
    gender: "",
    role: "",
    status: "",
    isBlocked: null,
    isDeleted: null,
    image: null,
  });

  const [actionForm, setActionForm] = useState<{
    action: string;
    reason: string;
    userId: string | null;
  }>({
    action: "",
    reason: "",
    userId: null,
  });


  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosConfig.get(USERS_LIST_URL, {
        params: {
          page,
          limit: 12,
          q: search || undefined,
          role: role || undefined,
          status: status || undefined,
          isBlocked: blocked || undefined,
          isDeleted: deleted || undefined,
        },
      });

      const { data, meta } = res?.data || {};
      setUsers(data || []);
      setMeta(meta || {});
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role, status, blocked, deleted]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setEditingUserId(user._id);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      age: user.age || "",
      dob: user.dob ? user.dob.slice(0, 10) : "",
      gender: user.gender || "",
      role: user.role || "",
      status: user.status || "",
      isBlocked: user.isBlocked ?? null,
      isDeleted: user.isDeleted ?? null,
      image: null,
    });

    setActionForm({ action: "", reason: "", userId: null });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEditForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleUpdate = async () => {
    if (!editingUserId) return;

    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("email", editForm.email);
    if (editForm.age) formData.append("age", editForm.age);
    if (editForm.dob) formData.append("dob", editForm.dob);
    if (editForm.gender) formData.append("gender", editForm.gender);
    if (editForm.role) formData.append("role", editForm.role);
    if (editForm.image) formData.append("image", editForm.image);

    try {
      await axiosConfig.put(UPDATE_USER_URL(editingUserId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };


  const handleAdminAction = async () => {
    if (!actionForm.userId || !actionForm.action) return;

    try {
      await axiosConfig.put(
        ADMIN_ACTION_URL,
        {
          userId: actionForm.userId,
          action: actionForm.action,
          reason: actionForm.reason || "",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );


      setActionForm({ action: "", reason: "", userId: null });
      setEditingUserId(null);
      fetchUsers();
    } catch (err: any) {
      // console.error("Admin action failed:", err.response?.data || err);

    }
  };


  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await axiosConfig.delete(DELETE_USER_URL(deleteId));
      cancelDelete();
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };


  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-4 md:p-6 border border-gray-200">

          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">
                  Are you sure you want to delete?
                </h2>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={confirmDelete}
                  >
                    Yes
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={cancelDelete}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Users List</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setView("table")}
                className={`px-3 md:px-4 py-1 md:py-2 rounded-lg text-sm md:text-base font-semibold transition 
                ${view === "table" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                Table View
              </button>
              <button
                onClick={() => setView("grid")}
                className={`px-3 md:px-4 py-1 md:py-2 rounded-lg text-sm md:text-base font-semibold transition 
                ${view === "grid" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                Grid View
              </button>
            </div>
          </div>

          <div className="bg-gray-100 p-2 md:p-4 rounded-lg shadow-sm mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 items-center">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="px-2 py-1 md:px-3 md:py-2 rounded border w-full text-sm"
              />

              <select
                value={role}
                onChange={(e) => { setRole(e.target.value); setPage(1); }}
                className="px-2 py-1 md:px-3 md:py-2 rounded border w-full text-sm"
              >
                <option value="">Role (All)</option>
                <option value="student">Student</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </select>

              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="px-2 py-1 md:px-3 md:py-2 rounded border w-full text-sm"
              >
                <option value="">Status (All)</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={blocked}
                onChange={(e) => { setBlocked(e.target.value); setPage(1); }}
                className="px-2 py-1 md:px-3 md:py-2 rounded border w-full text-sm"
              >
                <option value="">Blocked</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

              <select
                value={deleted}
                onChange={(e) => { setDeleted(e.target.value); setPage(1); }}
                className="px-2 py-1 md:px-3 md:py-2 rounded border w-full text-sm"
              >
                <option value="">Deleted</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

              <button
                onClick={handleSearch}
                className="px-3 md:px-4 py-1 md:py-2 bg-indigo-600 text-white rounded-lg text-sm md:text-base hover:bg-indigo-700 transition"
              >
                Search
              </button>
            </div>
          </div>

          {loading && <div className="text-center py-10 text-lg font-semibold text-gray-600">Loading...</div>}
          {!loading && users.length === 0 && <div className="text-center py-10 text-lg font-semibold text-gray-600">No users found.</div>}

          {!loading && view === "table" && users.length > 0 && (
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm text-gray-700">
                  <thead className="bg-indigo-200 text-gray-800 sticky top-0 z-10 uppercase text-xs">
                    <tr>
                      <th className="py-2 px-3 text-left">Image</th>
                      <th className="py-2 px-3 text-left">ID</th>
                      <th className="py-2 px-3 text-left">Name</th>
                      <th className="py-2 px-3 text-left">Email</th>
                      <th className="py-2 px-3 text-left">Age</th>
                      <th className="py-2 px-3 text-left">DOB</th>
                      <th className="py-2 px-3 text-left">Gender</th>
                      <th className="py-2 px-3 text-left">Role</th>
                      <th className="py-2 px-3 text-left">Status</th>
                      <th className="py-2 px-3 text-left">Blocked</th>
                      <th className="py-2 px-3 text-left">Deleted</th>
                      <th className="py-2 px-3 text-left">Created</th>
                      <th className="py-2 px-3 text-left">Updated</th>
                      <th className="py-2 px-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-gray-200 hover:bg-indigo-50 transition">
                        <td className="py-2 px-3">
                          {editingUserId === user._id ? (
                            <input type="file" onChange={handleFileChange} />
                          ) : (
                            <img
                              src={user.image?.optimizedUrl || user.image?.url}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                        </td>

                        <td className="py-2 px-3 ">{user._id}</td>

                        <td className="py-2 px-3">
                          {editingUserId === user._id ? (
                            <input
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="border px-1"
                            />
                          ) : (
                            user.name
                          )}
                        </td>

                        <td className="py-2 px-3">
                          {editingUserId === user._id ? (
                            <input
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="border px-1"
                            />
                          ) : (
                            user.email
                          )}
                        </td>

                        <td className="py-2 px-3">
                          {editingUserId === user._id ? (
                            <input
                              value={editForm.age || ""}
                              onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                              className="border px-1"
                            />
                          ) : (
                            user.age
                          )}
                        </td>

                        <td className="py-2 px-3">
                          {editingUserId === user._id ? (
                            <input
                              type="date"
                              value={editForm.dob || ""}
                              onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                              className="border px-1"
                            />
                          ) : (
                            safeSliceDate(user.dob)
                          )}
                        </td>

                        <td className="py-2 px-3">
                          {editingUserId === user._id ? (
                            <select
                              value={editForm.gender || ""}
                              onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                              className="border px-1"
                            >
                              <option value="">Select</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          ) : (
                            user.gender
                          )}
                        </td>

                        <td className="py-2 px-3">
                          {editingUserId === user._id ? (
                            <select
                              value={editForm.role || ""}
                              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                              className="border px-1"
                            >
                              <option value="">Select</option>
                              <option value="student">Student</option>
                              <option value="employer">Employer</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            user.role
                          )}
                        </td>

                        <td className="py-2 px-3">
                          <span className="px-2 py-1 rounded-full bg-green-500 text-white text-xs">
                            {user.status || "—"}
                          </span>
                        </td>

                        <td className="py-2 px-3">
                          {user.isBlocked ? <span className="text-red-600 font-semibold">Yes</span> : <span className="text-green-600">No</span>}
                        </td>

                        <td className="py-2 px-3">
                          {user.isDeleted ? <span className="text-red-600 font-semibold">Yes</span> : <span className="text-green-600">No</span>}
                        </td>

                        <td className="py-2 px-3">{safeSliceDate(user.createdAt)}</td>
                        <td className="py-2 px-3">{safeSliceDate(user.updatedAt)}</td>

                        <td className="py-2 px-3 flex flex-col gap-2">

                          {editingUserId === user._id ? (
                            <div className="flex gap-2">
                              <button
                                className="px-2 py-1 bg-green-500 text-white rounded"
                                onClick={handleUpdate}
                              >
                                Update
                              </button>
                              <button
                                className="px-2 py-1 bg-gray-300 rounded"
                                onClick={() => setEditingUserId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-2">
                                <button
                                  className="px-2 py-1 bg-blue-500 text-white rounded"
                                  onClick={() => handleEdit(user)}
                                >
                                  Edit
                                </button>

                                <button
                                  className="px-2 py-1 bg-red-500 text-white rounded"
                                  onClick={() => openDeleteModal(user._id)}
                                >
                                  Delete
                                </button>
                              </div>

                              <div className="relative inline-block">
                                <select
                                  className="border px-2 py-1 rounded"
                                  value={actionForm.userId === user._id ? actionForm.action : ""}
                                  onChange={(e) =>
                                    setActionForm({
                                      userId: user._id,
                                      action: e.target.value,
                                      reason: "",
                                    })
                                  }
                                >
                                  <option value="">Admin Action</option>
                                  <option value="BLOCK">Block</option>
                                  <option value="UNBLOCK">Unblock</option>
                                  <option value="DELETE">Delete</option>
                                  <option value="RESTORE">Restore</option>
                                  <option value="ACTIVATE">Activate</option>
                                  <option value="DEACTIVATE">Deactivate</option>
                                </select>

                                {actionForm.userId === user._id && actionForm.action && (
                                  <div className="flex flex-col gap-1 mt-2">
                                    <input
                                      className="border px-2 py-1 rounded text-xs"
                                      placeholder="Reason (optional)"
                                      value={actionForm.reason}
                                      onChange={(e) => setActionForm({ ...actionForm, reason: e.target.value })}
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        className="px-2 py-1 bg-purple-600 text-white rounded text-xs"
                                        onClick={handleAdminAction}
                                      >
                                        Apply
                                      </button>
                                      <button
                                        className="px-2 py-1 bg-gray-200 rounded text-xs"
                                        onClick={() => setActionForm({ action: "", reason: "", userId: null })}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && view === "grid" && users.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="
                  rounded-xl 
                  p-5 
                  shadow-md 
                  border border-indigo-300 
                  bg-gradient-to-br from-purple-200 via-indigo-100 to-blue-200
                  hover:shadow-2xl 
                  hover:scale-[1.04] 
                  transition-all 
                  duration-300
                "
                >
                  <div className="flex flex-col items-center w-full">
                    {editingUserId === user._id ? (
                      <div className="flex flex-col gap-3 w-full text-xs md:text-sm">
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="border px-3 py-2 rounded-lg w-full"
                          placeholder="Name"
                        />
                        <input
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="border px-3 py-2 rounded-lg"
                          placeholder="Email"
                        />
                        <input
                          value={editForm.age || ""}
                          onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                          className="border px-3 py-2 rounded-lg"
                          placeholder="Age"
                        />
                        <input
                          type="date"
                          value={editForm.dob || ""}
                          onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                          className="border px-3 py-2 rounded-lg"
                        />
                        <select
                          value={editForm.gender || ""}
                          onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                          className="border px-3 py-2 rounded-lg"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        <select
                          value={editForm.role || ""}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="border px-3 py-2 rounded-lg"
                        >
                          <option value="">Select</option>
                          <option value="student">Student</option>
                          <option value="employer">Employer</option>
                          <option value="admin">Admin</option>
                        </select>
                        <input type="file" onChange={handleFileChange} />
                        <div className="flex gap-3 mt-2">
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={handleUpdate}>
                            Update
                          </button>
                          <button className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400" onClick={() => setEditingUserId(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-xs sm:text-sm w-full">
                        <img
                          src={user.image?.optimizedUrl || user.image?.url}
                          alt={user.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-indigo-400 shadow-lg mb-3"
                        />
                        <div className="w-full space-y-1.5 text-left">
                          <p><strong>ID:</strong> {user._id}</p>
                          <p><strong>Name:</strong> {user.name}</p>
                          <p><strong>Email:</strong> {user.email}</p>
                          <p><strong>Age:</strong> {user.age}</p>
                          <p><strong>DOB:</strong> {safeSliceDate(user.dob)}</p>
                          <p><strong>Gender:</strong> {user.gender}</p>
                          <p><strong>Role:</strong> {user.role}</p>
                          <p><strong>Status:</strong> {user.status}</p>
                          <p><strong>Blocked:</strong> {user.isBlocked ? "Yes" : "No"}</p>
                          <p><strong>Deleted:</strong> {user.isDeleted ? "Yes" : "No"}</p>
                          <p><strong>Created:</strong> {safeSliceDate(user.createdAt)}</p>
                          <p><strong>Updated:</strong> {safeSliceDate(user.updatedAt)}</p>
                        </div>

                        <div className="flex gap-3 mt-3">
                          <button
                            className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 duration-200"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 duration-200"
                            onClick={() => openDeleteModal(user._id)}
                          >
                            Delete
                          </button>
                        </div>

                        <div className="mt-3 w-full">
                          <select
                            className="border px-2 py-1 rounded w-full"
                            value={actionForm.userId === user._id ? actionForm.action : ""}
                            onChange={(e) => setActionForm({ userId: user._id, action: e.target.value, reason: "" })}
                          >
                            <option value="">Admin Action</option>
                            <option value="BLOCK">Block</option>
                            <option value="UNBLOCK">Unblock</option>
                            <option value="DELETE">Delete</option>
                            <option value="RESTORE">Restore</option>
                            <option value="ACTIVATE">Activate</option>
                            <option value="DEACTIVATE">Deactivate</option>
                          </select>

                          {actionForm.userId === user._id && actionForm.action && (
                            <div className="flex flex-col gap-1 mt-2">
                              <input
                                className="border px-2 py-1 rounded text-xs"
                                placeholder="Reason (optional)"
                                value={actionForm.reason}
                                onChange={(e) => setActionForm({ ...actionForm, reason: e.target.value })}
                              />
                              <div className="flex gap-2">
                                <button className="px-2 py-1 bg-purple-600 text-white rounded text-xs" onClick={handleAdminAction}>
                                  Apply
                                </button>
                                <button className="px-2 py-1 bg-gray-200 rounded text-xs" onClick={() => setActionForm({ action: "", reason: "", userId: null })}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {meta?.totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2 md:gap-3 flex-wrap">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1 font-semibold">
                Page {meta?.page || page} / {meta?.totalPages || 1}
              </span>
              <button
                disabled={page === meta?.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UsersPage;
