import React, { useEffect, useState } from "react";
import axiosConfig from "../../config/axios.config";

import {
  FaUserGraduate,
  FaUserTie,
  FaClipboardList,
  FaMoneyBillWave,
  FaTasks,
  FaStar,
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

interface IApplicationsByStatus {
  pending: number;
  accepted: number;
  rejected: number;
  completed: number;
  paid: number;
}

interface ITopCategories {
  [key: string]: number;
}

export interface IAdminDashboard {
  totalStudents: number;
  totalEmployers: number;
  totalGigs: number;
  activeGigs: number;
  totalApplications: number;
  applicationsByStatus: IApplicationsByStatus;
  totalPayments: number;
  averageStudentRating: string | null;
  averageEmployerRating: string | null;
  topCategories: ITopCategories;
}

interface IGradientCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
}

interface IStatusCardProps {
  label: string;
  value: number;
}

interface ICategoryCardProps {
  category: string;
  count: number;
}

export const AdminDashboardPage = () => {
  const [data, setData] = useState<IAdminDashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosConfig.get("/dashboard/admin");
        setData(res.data);
      } catch (err) {
        console.error("DASHBOARD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-xl font-bold">Loading Dashboard...</div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center text-xl font-bold text-red-600">
        Failed to load dashboard.
      </div>
    );
  }

  const statusData = Object.entries(data.applicationsByStatus).map(([name, value]) => ({
    name,
    value,
  }));

  const categoryData = Object.entries(data.topCategories).map(([name, value]) => ({
    name,
    value,
  }));

  const overviewData = [
    {
      name: "Overview",
      Students: data.totalStudents,
      Employers: data.totalEmployers,
      Gigs: data.totalGigs,
    },
  ];

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen space-y-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GradientCard
            title="Total Students"
            value={data.totalStudents}
            icon={<FaUserGraduate size={28} />}
            gradient="from-blue-400 to-blue-600"
          />
          <GradientCard
            title="Total Employers"
            value={data.totalEmployers}
            icon={<FaUserTie size={28} />}
            gradient="from-green-400 to-green-600"
          />
          <GradientCard
            title="Total Gigs"
            value={data.totalGigs}
            icon={<FaClipboardList size={28} />}
            gradient="from-purple-400 to-purple-600"
          />
          <GradientCard
            title="Active Gigs"
            value={data.activeGigs}
            icon={<FaTasks size={28} />}
            gradient="from-amber-400 to-amber-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GradientCard
            title="Total Applications"
            value={data.totalApplications}
            icon={<FaClipboardList size={28} />}
            gradient="from-indigo-400 to-indigo-600"
          />
          <GradientCard
            title="Total Payments"
            value={`Rs. ${data.totalPayments}`}
            icon={<FaMoneyBillWave size={28} />}
            gradient="from-pink-400 to-pink-600"
          />
          <GradientCard
            title="Average Ratings"
            value={`S: ${data.averageStudentRating ?? "0"} ⭐ / E: ${data.averageEmployerRating ?? "0"} ⭐`}
            icon={<FaStar size={28} />}
            gradient="from-rose-400 to-rose-600"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Applications by Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(data.applicationsByStatus).map(([label, value]) => (
              <StatusCard key={label} label={label} value={value} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Top Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(data.topCategories).map(([category, count]) => (
              <CategoryCard key={category} category={category} count={count} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Applications by Status (Pie Chart)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={120} label>
                  {statusData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Top Categories (Bar Chart)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mt-10">
          <h2 className="text-lg font-semibold mb-4">Platform Overview (Line Chart)</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Students" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="Employers" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="Gigs" stroke="#ff7300" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

const COLORS = ["#8884d8", "#82ca9d", "#ff6378", "#ffc658", "#00C49F"];

const GradientCard: React.FC<IGradientCardProps> = ({
  title,
  value,
  icon,
  gradient,
}) => (
  <div
    className={`p-6 rounded-xl shadow-lg text-white flex items-center space-x-4 transform hover:scale-105 transition-transform duration-300 bg-gradient-to-r ${gradient}`}
  >
    <div>{icon}</div>
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  </div>
);

const StatusCard: React.FC<IStatusCardProps> = ({ label, value }) => (
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md border flex flex-col items-center justify-center transition">
    <div className="text-gray-500 text-sm uppercase">{label}</div>
    <div className="text-xl font-bold mt-2 text-gray-900">{value}</div>
  </div>
);

const CategoryCard: React.FC<ICategoryCardProps> = ({
  category,
  count,
}) => (
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md border flex justify-between items-center transition">
    <div className="text-gray-700 font-medium">{category}</div>
    <div className="text-gray-900 font-bold">{count}</div>
  </div>
);

export default AdminDashboardPage;
