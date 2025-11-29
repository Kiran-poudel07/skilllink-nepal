import { useEffect, useState } from "react";
import {
  AiOutlineEnvironment,
  AiOutlineDownload,
  AiOutlineClose,
} from "react-icons/ai";
import axiosConfig from "../../config/axios.config";
import { toast } from "sonner";
import { NavLink } from "react-router";

interface CompanyData {
  companyName: string;
  companyDescription: string;
  companyAddress: string;
  contactInfo: string;
  category: string;
  companyLogo: { original: string; optimized: string };
  companyDocs: { original: string; optimized: string };
}

const EmployerResumeView = () => {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    axiosConfig
      .get("upload/me")
      .then((res) => {
        setCompany(res.data);
      })
      .catch(() => setError("Failed to fetch company data"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axiosConfig.delete("upload/me");
      toast.success("Resume deleted successfully!");
      setCompany(null);
      setShowDeleteModal(false);
    } catch (err) {
      toast.error("Failed to delete resume. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
  return (
    <div className="min-h-screen flex flex-col gap-4 justify-center items-center text-gray-500">
      Loading...
      <NavLink
        to="create"
        className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
      >
        Create / Update Resume
      </NavLink>
    </div>
  );


  if (error)
  return (
    <div className="min-h-screen flex flex-col gap-4 justify-center items-center text-red-500">
      {error}
      <NavLink
        to="create"
        className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
      >
        Create / Update Resume
      </NavLink>
    </div>
  );


  if (!company)
  return (
    <div className="min-h-screen flex flex-col gap-4 justify-center items-center text-gray-500">
      No company data found
      <NavLink
        to="create"
        className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
      >
        Create / Update Resume
      </NavLink>
    </div>
  );


  return (
    <>
      <div className="min-h-screen w-full flex justify-center items-center bg-[#7b82d9] p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#eaeaff] p-10 flex flex-col items-center">
            {company.companyLogo?.optimized && (
              <div className="w-32 h-32 rounded-full border-4 border-[#262253] shadow-md overflow-hidden">
                <img
                  src={company.companyLogo.optimized}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="bg-[#262253] text-white p-8 rounded-t-3xl -mt-4 relative z-10">
            <h2 className="text-2xl font-bold text-center">
              {company.companyName}
            </h2>

            <div className="flex justify-center items-center gap-2 text-gray-300 mt-2">
              <AiOutlineEnvironment />
              <span>{company.companyAddress}</span>
            </div>

            <p className="text-center mt-2 text-gray-300">
              {company.companyDescription}
            </p>

            <div className="text-center mt-1 text-gray-400">
              Category: {company.category}
            </div>

            <div className="text-center mt-1 text-gray-400">
              Contact: {company.contactInfo}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <NavLink
                to="/employer"
                className="px-5 py-2 rounded-xl bg-[#1e1a45] border border-[#443c91] hover:bg-[#302a6d] transition shadow"
              >
                Back
              </NavLink>

              <NavLink
                to="create"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition shadow"
              >
                Edit
              </NavLink>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition shadow"
              >
                Delete
              </button>
            </div>

            <div className="border-t border-gray-600 my-6"></div>

            <h3 className="text-lg font-semibold mb-3">Company Document</h3>

            {company.companyDocs?.optimized ? (
              <a
                href={company.companyDocs.optimized}
                target="_blank"
                className="flex justify-between items-center p-3 bg-[#1e1a45] rounded-xl border border-[#443c91] hover:bg-[#2c255c] transition"
              >
                <span>View Document</span>
                <AiOutlineDownload className="text-xl" />
              </a>
            ) : (
              <p className="text-gray-400">No document available</p>
            )}
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border space-y-5 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
                <AiOutlineClose
                  className="text-2xl cursor-pointer text-gray-600 hover:text-gray-900"
                  onClick={() => setShowDeleteModal(false)}
                />
              </div>

              <p className="text-gray-700">
                Are you sure you want to delete your resume?
              </p>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  No
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`px-5 py-2 rounded-lg text-white transition shadow-md ${deleting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                    }`}
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EmployerResumeView;