import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { AiOutlineHome, AiOutlinePhone, AiOutlineAppstore } from "react-icons/ai";
interface CompanyImage {
  original: string;
  optimized: string;
}

interface Employer {
  _id: string;
  name: string;
  email: string;
  companyName: string;
  companyDescription: string;
  companyAddress: string;
  contactInfo: string;
  companyLogo: CompanyImage;
  category: string | null;
  totalGigs: number;
}

interface EmployerApiResponse {
  status: string;
  data: Employer[];
  page: number;
  limit: number;
  total: number;
}

interface StatsApiResponse {
  status: string;
  data: {
    totalGigs: number;
    activeGigs: number;
    totalStudents: number;
    totalEmployers: number;
  };
}

const PublicEmployers = () => {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [stats, setStats] = useState<StatsApiResponse["data"] | null>(null);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const [page, setPage] = useState(1);
  const limit = 9;

  const [total, setTotal] = useState(0);


  const loadEmployers = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `https://skilllink-nepal-backend-new.onrender.com/api/test/public/employers?name=${search}&category=${category}&sort=${sort}&page=${page}&limit=${limit}`||`http://127.0.0.1:9005/api/test/public/employers?name=${search}&category=${category}&sort=${sort}&page=${page}&limit=${limit}`
      );

      const json: EmployerApiResponse = await res.json();

      setEmployers(json.data);
      setTotal(json.total);
    } catch (err) {
      console.error("Failed to load employers:", err);
    }

    setLoading(false);
  };


  const loadStats = async () => {
    setStatsLoading(true);

    try {
      const res = await fetch(`http://127.0.0.1:9005/api/test/public/stats`);
      const json: StatsApiResponse = await res.json();
      setStats(json.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }

    setStatsLoading(false);
  };

  useEffect(() => {
    loadEmployers();
  }, [search, category, sort, page]);

  useEffect(() => {
    loadStats();
  }, []);


  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 p-8 overflow-y-auto">
        <div className="flex justify-end mb-8">

          <NavLink
            to="/auth"
            className="
            px-5 py-2 rounded-xl text-white font-semibold shadow-lg
            bg-gradient-to-r from-blue-500 to-purple-500
            hover:from-purple-600 hover:to-blue-600 transition
          "
          >
            Login
          </NavLink>
        </div>
        <div className="max-w-7xl mx-auto">

          <h1
            className="
            text-4xl md:text-5xl font-extrabold text-center 
            bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-600 to-blue-600
          "
          >
            Explore Employers
          </h1>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(statsLoading ? Array(4).fill(null) : [stats?.totalGigs, stats?.activeGigs, stats?.totalStudents, stats?.totalEmployers])
              .map((value, idx) => (
                <div
                  key={idx}
                  className="
                  p-5 bg-white/60 rounded-xl shadow 
                  backdrop-blur text-center 
                "
                >
                  {statsLoading ? (
                    <div className="h-6 w-16 bg-gray-300 animate-pulse mx-auto rounded"></div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-purple-700">{value}</h2>
                      <p className="text-gray-600 text-sm">
                        {["Total Gigs", "Active Gigs", "Students", "Employers"][idx]}
                      </p>
                    </>
                  )}
                </div>
              ))}
          </div>

          <div
            className="
          mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 
          bg-white/50 p-5 rounded-2xl backdrop-blur shadow-lg
        "
          >
            <input
              type="text"
              placeholder="Search by employer name..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="
              px-4 py-3 rounded-xl border outline-none 
              focus:border-purple-500 bg-white/70
            "
            />

            <select
              value={category}
              onChange={(e) => {
                setPage(1);
                setCategory(e.target.value);
              }}
              className="
              px-4 py-3 rounded-xl border outline-none 
              focus:border-purple-500 bg-white/70
            "
            >
              <option value="">All Categories</option>
              <option value="IT">IT</option>
              <option value="Electronic">Electronic</option>
              <option value="Finance">Finance</option>
            </select>

            <select
              value={sort}
              onChange={(e) => {
                setPage(1);
                setSort(e.target.value);
              }}
              className="
              px-4 py-3 rounded-xl border outline-none 
              focus:border-purple-500 bg-white/70
            "
            >
              <option value="">Sort by</option>
              <option value="alphabetical">A → Z</option>
              <option value="latest">Newest</option>
            </select>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {loading &&
              [...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse h-64 bg-white/40 rounded-xl shadow"></div>
              ))}

            {!loading &&
              employers.map((emp) => (
                <div
                  key={emp._id}
                  className="
                  bg-white rounded-2xl shadow-lg border border-gray-200
                  p-5 hover:shadow-2xl hover:-translate-y-1 
                  transition-all duration-300 cursor-pointer 
                  hover:bg-gradient-to-br hover:from-white hover:to-purple-100
                "
                >
                  <img
                    src={emp.companyLogo.optimized}
                    alt={emp.companyName}
                    className="w-full h-36 object-cover rounded-xl shadow"
                  />
                  <p className="text-center mt-4">EmployerName: {emp.name}</p>
                  <p className="text-gray-500 text-center text-sm mt-2">Email: {emp.email}</p>
                  <h2 className="mt-1 text-xl text-center font-bold text-gray-800">Company:
                    {emp.companyName}
                  </h2>

                  <p className="text-gray-600 text-center text-sm mt-1">
                    {emp.companyDescription}
                  </p>

                  <p className="text-gray-500 text-center text-sm mt-2 flex items-center justify-center gap-1">
                    <AiOutlineHome className="text-base" />
                    {emp.companyAddress}
                  </p>

                  <p className="text-gray-500 text-center text-sm mt-2 flex items-center justify-center gap-1">
                    <AiOutlinePhone className="text-base" />
                    {emp.contactInfo}
                  </p>

                  <div className="mt-2 text-sm text-center font-semibold text-purple-700">
                    Category: {emp.category ?? "N/A"}
                  </div>

                  <p className="text-gray-500 text-center text-sm mt-2 flex items-center justify-center gap-1">
                    <AiOutlineAppstore className="text-base" />
                    {emp.totalGigs} Gigs
                  </p>

                </div>
              ))}
          </div>

          <div className="mt-10 flex justify-center gap-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`
                px-4 py-2 rounded-xl shadow 
                ${page === i + 1
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 hover:bg-purple-200"}
              `}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <p className="text-center mt-16 text-gray-700">
            © {new Date().getFullYear()} SkillLink — Connecting Skills & Opportunities
          </p>
        </div>
      </div>
    </>
  );
};

export default PublicEmployers;
