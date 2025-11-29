import { useEffect, useState } from "react";
import { AiOutlineDownload, AiOutlineDelete } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import axiosConfig from "../../config/axios.config";
import { toast } from "sonner";
import { useAuth } from "../../context/auth.context";
import { NavLink, useNavigate } from "react-router";

interface ProfileData {
  avatar?: { optimized: string };
  resume?: { optimized: string };
  role: string;
  skills: string[];
  bio: string;
  education: string;
  experience: string;
  portfolioLinks: string[];
}

const StudentResumeView = () => {

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { loggedInUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosConfig.get("upload/me");
        setProfile(res.data);
      } catch (err) {
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axiosConfig.delete("upload/me");
      toast.success("Resume deleted successfully!");
      setProfile(null);
      navigate('/student');
    } catch (err) {
      toast.error("Failed to delete resume");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const SkillRatingDots = () => {
    const dots = [true, true, true, false, false];
    return (
      <div className="flex items-center space-x-1 ml-auto">
        {dots.map((filled, idx) => (
          <div key={idx} className={`w-2 h-2 rounded-full ${filled ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="h-screen flex justify-center items-center">Loading...</div>;

  if (!profile) return (
    <div className="h-screen flex flex-col justify-center items-center">
      <p className="text-lg mb-3">No profile found.</p>
       <button
        onClick={() => navigate('create')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg"
      >
        Create / Update Resume
      </button>
      <NavLink to="/student/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Back</NavLink>
    </div>
  );

  return (
    <>
      <div className="min-h-screen w-full flex justify-center items-start p-0">
        <div className="w-full max-w-4xl shadow-2xl">

          <div className="bg-gray-100 p-6 sm:p-10 relative rounded-t-lg">

            <button
              onClick={() => navigate('/student/dashboard')}
              className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
            >
              <FaArrowLeft /> Back
            </button>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={deleting}
              className={`absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-lg text-white text-sm shadow-md ${deleting ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {deleting ? "Deleting..." : <><AiOutlineDelete /> Delete</>}
            </button>

            <div className="pt-6  px-2">
              <h1 className="text-4xl font-bold text-gray-900 break-words">
                {loggedInUser?.name}
              </h1>
              <h2 className="text-sm text-gray-600 mt-1 break-words">
                {loggedInUser?.email}
              </h2>
            </div>


            <div className="flex justify-center mt-6">
              <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-green-500">
                <img src={profile.avatar?.optimized} className="w-full h-full object-cover" />
              </div>
            </div>

            {profile.bio && (
              <p className="text-center mt-4 text-gray-700 max-w-xl mx-auto text-sm">{profile.bio}</p>
            )}

            {profile.resume?.optimized && (
              <div className="flex justify-center mt-4">
                <a href={profile.resume.optimized} target="_blank" className="text-blue-600 flex items-center gap-1">
                  <AiOutlineDownload /> View Resume
                </a>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 mt-6 text-sm">
              {[
                ["bg-green-600", "Passionate"],
                ["bg-green-500", "Independent"],
                ["bg-yellow-400", "Adaptable"],
                ["bg-yellow-500", "Optimistic"],
                ["bg-red-400", "Confident"]
              ].map(([color, label], i) => (
                <div key={i} className="flex items-center">
                  <span className={`w-2 h-2 rounded-full ${color} mr-2`}></span>{label}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-10 rounded-b-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">

              <div>
                <h3 className="text-2xl font-semibold mb-4">Education</h3>
                <p className="text-sm text-gray-700">{profile.education}</p>

                <h3 className="text-2xl font-semibold mb-4 mt-6">Experience</h3>
                <p className="text-sm text-gray-700 ">{profile.experience}</p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Skills</h3>

                {profile.skills.length ? profile.skills.map((skill, i) => (
                  <div key={i} className="flex justify-between items-center mb-2">
                    <span>{skill}</span>
                    <SkillRatingDots />
                  </div>
                )) : <p>No skills listed.</p>}

                <h3 className="text-2xl font-semibold mb-4 mt-6">Portfolio Links</h3>
                {profile.portfolioLinks?.length ? (
                  <ul>
                    {profile.portfolioLinks.map((url, i) => (
                      <li key={i}><a href={url} className="text-blue-600 break-all" target="_blank">{url}</a></li>
                    ))}
                  </ul>
                ) : <p>No portfolio links.</p>}
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={() => navigate('create')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg"
              >
                Update Resume
              </button>
            </div>
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-3">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
              <h3 className="text-lg font-semibold mb-3">Delete Resume?</h3>
              <p className="text-sm text-gray-600 mb-6">This action cannot be undone.</p>

              <div className="flex justify-between gap-3">
                <button
                  className="w-full py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="w-full py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default StudentResumeView;
