import React, { useEffect, useState } from "react";
import axiosConfig from "../../config/axios.config";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  AiOutlineAppstore,
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineDollarCircle,
  AiOutlineStar,
} from "react-icons/ai";

type IAppliedGigsCategory = Record<string, number>;

export interface IStudentDashboardData {
  totalApplications: number;
  applicationsPending: number;
  applicationsAccepted: number;
  applicationsRejected: number;
  applicationsCompleted: number;
  applicationsPaid: number;
  totalEarnings: number;
  averageRating: number;
  appliedGigsByCategory: IAppliedGigsCategory;
}

interface IStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
}

const PIE_COLORS = ["#7C3AED", "#06B6D4", "#F59E0B", "#EF4444", "#10B981"];
const BAR_COLOR = "#06B6D4";

export const StudentDashboardPage: React.FC = () => {
  const [data, setData] = useState<IStudentDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isHovering, setIsHovering] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await axiosConfig.get("/dashboard/student");
        if (mounted) setData(res.data);
      } catch (err) {
        console.error("Student Dashboard fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const categoryData = data
    ? Object.entries(data.appliedGigsByCategory).map(([name, value]) => ({
      name,
      value,
    }))
    : [];

  const barChartData = categoryData.length
    ? categoryData
    : [{ name: "No Data", value: 0 }];

  if (loading) {
    return (
      <div className="p-10 min-h-screen bg-gray-50">
        <h1 className="text-4xl font-extrabold mb-8">Student Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden bg-white/60 rounded-2xl h-36 border border-white/10"
              style={{ backdropFilter: "blur(6px)" }}
            >
              <div className="absolute inset-0 animate-gradient-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 rounded-2xl bg-white/60 border" style={{ backdropFilter: "blur(6px)" }} />
          <div className="h-72 rounded-2xl bg-white/60 border" style={{ backdropFilter: "blur(6px)" }} />
        </div>

        <style>{`
          @keyframes gradientShimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-gradient-shimmer {
            animation: gradientShimmer 1.6s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-red-500 mt-4">Failed to load dashboard data.</p>
      </div>
    );
  }

  const statCards: IStatCardProps[] = [
    {
      title: "Total Applications",
      value: data.totalApplications,
      icon: <AiOutlineAppstore size={36} />,
      gradientFrom: "from-indigo-500",
      gradientTo: "to-indigo-700",
    },
    {
      title: "Pending",
      value: data.applicationsPending,
      icon: <AiOutlineClockCircle size={36} />,
      gradientFrom: "from-yellow-400",
      gradientTo: "to-yellow-600",
    },
    {
      title: "Accepted",
      value: data.applicationsAccepted,
      icon: <AiOutlineCheckCircle size={36} />,
      gradientFrom: "from-green-400",
      gradientTo: "to-green-700",
    },
    {
      title: "Rejected",
      value: data.applicationsRejected,
      icon: <AiOutlineCloseCircle size={36} />,
      gradientFrom: "from-red-400",
      gradientTo: "to-red-700",
    },
    {
      title: "Completed",
      value: data.applicationsCompleted,
      icon: <AiOutlineCheckCircle size={36} />,
      gradientFrom: "from-purple-500",
      gradientTo: "to-purple-700",
    },
    {
      title: "Paid",
      value: data.applicationsPaid,
      icon: <AiOutlineDollarCircle size={36} />,
      gradientFrom: "from-emerald-400",
      gradientTo: "to-emerald-700",
    },
    {
      title: "Total Earnings",
      value: `Rs. ${data.totalEarnings}`,
      icon: <AiOutlineDollarCircle size={36} />,
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-700",
    },
    {
      title: "Avg Rating",
      value: data.averageRating?.toFixed(1),
      icon: <AiOutlineStar size={36} />,
      gradientFrom: "from-orange-400",
      gradientTo: "to-orange-600",
    },
  ];

  return (
    <>
      <div className="p-10 min-h-screen bg-[radial-gradient(circle_at_10%_10%,_rgba(99,102,241,0.06),_transparent_20%),_radial-gradient(circle_at_90%_90%,_rgba(16,185,129,0.04),_transparent_20%)]">
        <h1 className="text-4xl font-extrabold mb-8">Student Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((c) => (
            <StatCard
              key={c.title}
              title={c.title}
              value={c.value}
              icon={c.icon}
              gradientFrom={c.gradientFrom}
              gradientTo={c.gradientTo}
              onHoverChange={(isOn) => setIsHovering(isOn ? c.title : null)}
            />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section
            className="rounded-2xl p-6 border bg-white/30"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <h2 className="text-xl font-semibold mb-4">Applied Gigs by Category (Bar)</h2>

            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart
                  data={barChartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill={BAR_COLOR}
                    animationDuration={1000}
                    barSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-4 text-sm text-gray-700/80">
              Animated bars show your applied gigs distribution. Hover any bar to highlight.
            </p>
          </section>

          <section
            className="rounded-2xl p-6 border bg-white/30 relative overflow-hidden"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <div
              className="pointer-events-none absolute -inset-1 rounded-2xl"
              style={{
                boxShadow:
                  isHovering != null
                    ? "0 8px 40px rgba(124,58,237,0.18), inset 0 1px 0 rgba(255,255,255,0.06)"
                    : "0 6px 20px rgba(16,185,129,0.06)",
              }}
            />

            <h2 className="text-xl font-semibold mb-4">Category Distribution (Pie)</h2>

            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    innerRadius={50}
                    paddingAngle={4}
                    label
                  >
                    {categoryData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {categoryData.map((c, i) => (
                <div
                  key={c.name}
                  onMouseEnter={() => setIsHovering(c.name)}
                  onMouseLeave={() => setIsHovering(null)}
                  className={`
                  px-3 py-1 rounded-md text-sm font-medium cursor-pointer
                  transition-all duration-250
                  ${isHovering === c.name ? "scale-105 shadow-neon" : "opacity-90"}
                `}
                  style={{
                    background:
                      isHovering === c.name ? "linear-gradient(90deg, rgba(124,58,237,0.16), rgba(6,182,212,0.08))" : "rgba(255,255,255,0.75)",
                    boxShadow:
                      isHovering === c.name
                        ? "0 6px 18px rgba(124,58,237,0.18), 0 0 12px rgba(6,182,212,0.06)"
                        : "none",
                  }}
                >
                  <span style={{ color: PIE_COLORS[i % PIE_COLORS.length] }}>{c.name}</span>
                  <span className="ml-2 text-gray-700/90">({c.value})</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <style>{`
        .shadow-neon {
          box-shadow: 0 8px 30px rgba(124,58,237,0.12), 0 0 18px rgba(124,58,237,0.12);
        }
        /* slight smoother transitions */
        .transition-all { transition: all 220ms cubic-bezier(.2,.9,.3,1); }
      `}</style>
      </div>
    </>
  );
};

const StatCard: React.FC<
  IStatCardProps & { onHoverChange?: (isOn: boolean) => void }
> = ({ title, value, icon, gradientFrom, gradientTo, onHoverChange }) => {
  return (
    <div
      onMouseEnter={() => onHoverChange && onHoverChange(true)}
      onMouseLeave={() => onHoverChange && onHoverChange(false)}
      className={`
        relative overflow-hidden rounded-2xl p-6 border
        bg-white/40 backdrop-blur-md
        hover:scale-105 transform transition-all
        cursor-pointer
      `}
      style={{
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div
        className={`absolute -inset-0.5 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-100`}
        style={{
          filter: "blur(24px)",
          zIndex: 0,
          transition: "opacity 280ms ease",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }} className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-800/90">{title}</p>
          <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
        </div>

        <div
          className="p-3 rounded-lg"
          style={{
            background: "rgba(255,255,255,0.6)",
            boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
          }}
        >
          {icon}
        </div>
      </div>

      <div
        className="absolute left-4 right-4 bottom-3 h-0.5 rounded"
        style={{
          background:
            "linear-gradient(90deg, rgba(124,58,237,0.6), rgba(6,182,212,0.25))",
          opacity: 0.9,
        }}
      />
    </div>
  );
};

export default StudentDashboardPage;
