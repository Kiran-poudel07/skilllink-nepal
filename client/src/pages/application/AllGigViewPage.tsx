import { useEffect, useState } from "react";
import {
  AiOutlineSearch,
  AiOutlineFilter,
  AiOutlineClockCircle,
  AiOutlineDollarCircle,
  AiOutlineUser,
  AiOutlineAppstore,
  AiOutlineCode,
  AiOutlineCalendar,
  AiOutlineMail,
  AiOutlineUnorderedList,
  AiOutlineIdcard,
  AiOutlineTeam,
} from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import axiosConfig from "../../config/axios.config";
import { useAuth } from "../../context/auth.context";
import { useNavigate } from "react-router";

interface IEmployer {
  _id: string;
  name: string;
  email: string;
}

interface IGig {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  duration: string;
  requiredSkills: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  employer: IEmployer;
  applicationsCount: number;
}

interface IGigResponse {
  status: string;
  gigs: IGig[];
  total: number;
}

interface IUser {
  role: "student" | "employer" | "admin";
}

const AllGigViewPage = () => {
  const navigate = useNavigate();
  const handleApplyNow = (gigId: string) => {
    navigate("/student/applications/apply", { state: { gigId } });
  };

  const [gigs, setGigs] = useState<IGig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [limit] = useState<number>(6);
  const [user, setUser] = useState<IUser | null>(null);
  const { loggedInUser } = useAuth();

  // Filters
  const [search, setSearch] = useState<string>("");
  const [gigIdSearch, setGigIdSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [minBudget, setMinBudget] = useState<string>("");
  const [maxBudget, setMaxBudget] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchByIdMode, setSearchByIdMode] = useState<boolean>(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        console.error("Invalid user in localStorage");
      }
    }
  }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const res = await axiosConfig.get<IGigResponse>(
        `/gig/all?page=${page}&limit=${limit}`,
        {
          params: {
            category: category || undefined,
            skills: skills || undefined,
            minBudget: minBudget || undefined,
            maxBudget: maxBudget || undefined,
          },
        }
      );

      const data = res.data;
      if (data?.gigs) {
        const filtered = search
          ? data.gigs.filter((g: IGig) =>
            g.title.toLowerCase().includes(search.toLowerCase())
          )
          : data.gigs;

        setGigs(filtered);
        setTotal(data.total);
        setSearchByIdMode(false);
      }
    } catch (err) {
      console.error("Error fetching gigs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGigById = async () => {
    if (!gigIdSearch.trim()) return;
    try {
      setLoading(true);
      const res = await axiosConfig.get<{ gig: IGig }>(
        `/gig/${gigIdSearch.trim()}`
      );
      const gig = res.data?.gig;
      if (gig) {
        setGigs([gig]);
        setTotal(1);
        setSearchByIdMode(true);
      } else {
        setGigs([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Error fetching gig by ID:", err);
      setGigs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchByIdMode) fetchGigs();
  }, [page, limit, category, skills, minBudget, maxBudget, search, searchByIdMode]);

  const resetSearchById = () => {
    setGigIdSearch("");
    setSearchByIdMode(false);
    fetchGigs();
  };

  return (
    <>
      <div
        className="p-4 sm:p-6 space-y-6 min-h-screen"
        style={{
          background:
            "linear-gradient(120deg, rgba(186,230,253,0.6), rgba(219,234,254,0.7), rgba(240,249,255,0.6))",
          backgroundSize: "400% 400%",
          animation: "gradientMove 10s ease infinite",
        }}
      >
        <style>
          {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            25% { background-position: 50% 100%; }
            50% { background-position: 100% 50%; }
            75% { background-position: 50% 0%; }
            100% { background-position: 0% 50%; }
          }
        `}
        </style>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
            All Active Gigs
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-grow">
              <AiOutlineSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-3 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/70"
              />
            </div>

            <div className="relative flex-grow">
              <AiOutlineIdcard className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by Gig ID..."
                value={gigIdSearch}
                onChange={(e) => setGigIdSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchGigById()}
                className="pl-10 pr-3 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/70"
              />
            </div>

            {searchByIdMode && (
              <button
                onClick={resetSearchById}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Show All
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100 transition bg-white/80"
              >
                <AiOutlineFilter /> Filters
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute right-0 mt-2 w-64 bg-white/90 border rounded-lg shadow-lg p-4 flex flex-col gap-3 z-10"
                  >
                    <input
                      type="text"
                      placeholder="Category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                    <input
                      type="text"
                      placeholder="Skills (comma separated)"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                    <input
                      type="number"
                      placeholder="Min Budget"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                    <input
                      type="number"
                      placeholder="Max Budget"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <AiOutlineUnorderedList className="animate-spin mr-2 text-xl" />
            Loading gigs...
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No gigs found.</div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig) => (
              <motion.div
                key={gig._id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(219,234,254,0.9), rgba(191,219,254,0.8), rgba(221,214,254,0.8))",
                  backgroundSize: "300% 300%",
                  animation: "gradientMove 8s ease infinite",
                }}
                className="border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full w-full max-w-[380px] mx-auto backdrop-blur-sm"
              >
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                      <AiOutlineIdcard className="text-blue-600" />
                      {gig.title}
                    </h2>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 capitalize">
                      {gig.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-3 line-clamp-3">{gig.description}</p>
                  <div className="flex items-center text-gray-600 gap-2 text-sm mb-1">
                    <AiOutlineAppstore className="text-indigo-500 " />
                    <span className="break-all flex-1">{gig._id}</span>
                  </div>
                  <div className="flex items-center text-gray-600 gap-2 text-sm mb-1">
                    <AiOutlineAppstore className="text-indigo-500" />
                    <span>{gig.category}</span>
                  </div>
                  <div className="flex items-center text-gray-600 gap-2 text-sm mb-1">
                    <AiOutlineDollarCircle className="text-green-600" />
                    <span>${gig.budget}</span>
                  </div>
                  <div className="flex items-center text-gray-600 gap-2 text-sm mb-2">
                    <AiOutlineClockCircle className="text-purple-500" />
                    <span>{gig.duration}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {gig.requiredSkills?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        <AiOutlineCode /> {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 border-t pt-3 text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <AiOutlineUser className="text-gray-500" />
                      <span className="break-all flex-1">{gig.employer?._id}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AiOutlineUser className="text-gray-500" />
                      <span>{gig.employer?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AiOutlineMail className="text-gray-500" />
                      <span className="break-all flex-1">{gig.employer?.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AiOutlineTeam className="text-gray-500" />
                      <span>Applications: {gig.applicationsCount}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                    <AiOutlineCalendar />
                    Created: {new Date(gig.createdAt).toLocaleDateString()} | Updated:{" "}
                    {new Date(gig.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                {loggedInUser && loggedInUser.role === "student" && (
                  <div className="p-4">
                    <button
                      onClick={() => handleApplyNow(gig._id)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition"
                    >
                      Apply Now
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {!searchByIdMode && (
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className={`border px-4 py-2 rounded-lg hover:bg-gray-100 ${page <= 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {Math.ceil(total / limit) || 1}
            </span>
            <button
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage(page + 1)}
              className={`border px-4 py-2 rounded-lg hover:bg-gray-100 ${page >= Math.ceil(total / limit)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
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

export default AllGigViewPage;
