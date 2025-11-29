import { message, Badge } from "antd";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from "react-router";
import axiosConfig from "../../config/axios.config";
import NotificationPanel from "../../pages/notification/NotificationPage";
import { useState, useEffect } from "react";

interface IUnread {
  unreadCount: number
}
const HeaderBar = () => {
  const navigate = useNavigate();
  const [unread, setUnread] = useState<IUnread>({ unreadCount: 0 });

  const fetchUnread = async () => {
    try {
      const res = await axiosConfig.get("/notification/unread");

      console.log("FULL API RESPONSE:", res.data);

      const count =
        res.data?.data?.unreadCount ??
        res.data?.unreadCount ??
        0;

      setUnread({ unreadCount: count });

    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  };

  useEffect(() => {
    fetchUnread();
  }, []);

  const logout = async () => {
    try {
      await axiosConfig.post("/auth/logout");
      localStorage.clear();
      navigate("/auth");
      message.success("Logged out");
    } catch {
      message.error("Logout failed");
    }
  };




  return (
    <>
      <div className="flex items-center gap-6">
      {/* Notification Bell */}
      <div className="mt-8">
        <Badge count={unread.unreadCount} offset={[0, 0]} overflowCount={99}>

          <NotificationPanel
          // onUnreadChange={(count: number) => 
          //   setUnread({ unreadCount: count })
          // }
          />
        </Badge>

      </div>
      <button
        onClick={logout}
        className="
    flex items-center gap-2
    bg-red-800 hover:bg-red-600
    text-white font-semibold
    px-4 py-2 rounded-lg
    shadow-md hover:shadow-lg
    transition
    text-sm sm:text-base md:text-base lg:text-base
    focus:outline-none focus:ring-2 focus:ring-red-400
  "
      >
        <AiOutlineLogout size={20} />
        Logout
      </button>


    </div>
    </>
  );
};

export default HeaderBar;
