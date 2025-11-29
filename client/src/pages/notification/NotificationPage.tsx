import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineDelete, AiOutlineBell } from "react-icons/ai";
import axiosConfig from "../../config/axios.config";

interface Sender {
  name: string;
  email: string;
}

interface Notification {
  _id: string;
  sender: Sender;
  type: string;
  title: string;
  message: string;
  gigTitle?: string;
  isRead: boolean;
  createdAt: string;
}

const timeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  for (const key in intervals) {
    const count = Math.floor(seconds / intervals[key]);
    if (count >= 1) return count === 1 ? `1 ${key} ago` : `${count} ${key}s ago`;
  }
  return "Just now";
};

const NotificationPanel: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/notification");
      const data = res.data.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axiosConfig.patch(`notification/${id}/read`, { id });

      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );

      const clicked = notifications.find(n => n._id === id);
      if (clicked && !clicked.isRead) {
        setUnreadCount(prev => Math.max(prev - 1, 0));
      }

    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axiosConfig.delete(`notification/delete/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));

      const removed = notifications.find(n => n._id === id);
      if (removed && !removed.isRead) setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter(n => !n.isRead);

  return (
    <>
      <div
        className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition"
        onClick={() => setOpen(prev => !prev)}
      >
        <AiOutlineBell
          size={28}
          className="
    text-gray-700 
    bg-yellow-400 
    p-1 
    rounded-full 
    cursor-pointer
    sm:size-5 
    md:size-6 
    lg:size-7 
    xl:size-8
  "
        />


        {/* {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )} */}
      </div>

      <div
        className={`
          fixed top-0 right-0 h-full w-full sm:w-[480px] bg-pink-50
          shadow-2xl z-50 overflow-y-auto transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="sticky top-0 z-10 bg-pink-50 px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
          <AiOutlineClose
            className="text-2xl cursor-pointer hover:text-gray-500"
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="px-6 flex gap-4 mb-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-sm rounded-md transition ${filter === "all"
              ? "bg-gray-800 text-white"
              : "text-gray-700 hover:bg-gray-200"
              }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 text-sm rounded-md transition ${filter === "unread"
              ? "bg-gray-800 text-white"
              : "text-gray-700 hover:bg-gray-200"
              }`}
          >
            Unread
          </button>
        </div>

        <div className="px-4 pb-6 space-y-3">
          {loading && <p className="text-center text-gray-500">Loading...</p>}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-gray-500">No notifications found</p>
          )}

          {!loading &&
            filtered.map(n => (
              <div
                key={n._id}
                onClick={() => !n.isRead && markAsRead(n._id)}
                className={`p-4 rounded-xl cursor-pointer relative transition shadow-sm ${n.isRead ? "bg-green-100" : "bg-pink-100"
                  } hover:bg-gray-200`}
              >
                {!n.isRead && (
                  <span className="absolute top-3 left-3 w-3 h-3 bg-blue-500 rounded-full" />
                )}

                <AiOutlineDelete
                  className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-lg"
                  onClick={e => {
                    e.stopPropagation();
                    deleteNotification(n._id);
                  }}
                />

                <p className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">Sender:</span>{" "}
                  {n.sender?.name} ({n.sender?.email})
                </p>

                <p className="text-sm mt-1">
                  <span className="font-semibold text-indigo-700">{n.type}</span>{" "}
                  — <span className="text-gray-900 font-semibold">{n.title}</span>
                </p>

                <p className="text-gray-700 text-sm mt-1">{n.message}</p>

                {n.gigTitle && (
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-semibold text-gray-700">Gig:</span>{" "}
                    {n.gigTitle}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-2">{timeAgo(n.createdAt)}</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
