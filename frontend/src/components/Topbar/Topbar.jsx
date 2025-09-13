import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Topbar({ sidebarOpen, setSidebarOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const crumbs = location.pathname.split("/").filter((c) => c);

  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 border-b border-gray-200">
      {/* Left side: Hamburger + Page Info */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-600 hover:text-[var(--primary-color)] transition"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <HiMiniBars3BottomLeft className="w-6 h-6" />
        </button>

        {/* Title + Breadcrumbs */}
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-color,#111827)] tracking-tight capitalize">
            {crumbs[crumbs.length - 1] || "Dashboard"}
          </h1>
          <nav className="flex items-center text-xs text-gray-400 space-x-1 mt-0.5">
            <span>Home</span>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center space-x-1 capitalize">
                <span>/</span>
                <span>{c}</span>
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-5 relative">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative text-gray-600 hover:text-[var(--primary-color)] transition"
          >
            <IoNotificationsOutline className="text-xl" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-medium px-1.5 rounded-full">
              3
            </span>
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-20 animate-fadeIn">
              <p className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                Notifications
              </p>
              <div className="max-h-52 overflow-y-auto divide-y">
                <p className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                  ✅ New issue created
                </p>
                <p className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                  📦 Stock updated successfully
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border border-gray-200"
            />
            <span className="text-sm font-medium text-gray-700 hidden md:inline">
              Raj
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20 animate-fadeIn">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <FaUserCircle className="text-gray-500" /> Profile
              </Link>
              <button
                onClick={() => alert("Logging out...")}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
