import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaSearch, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Topbar({ sidebarOpen, setSidebarOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const crumbs = location.pathname.split("/").filter((c) => c);

  return (
    <header className="flex items-center justify-between bg-[var(--background-color)] px-6 py-3 shadow-md">
      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-[var(--text-color)]"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <HiMiniBars3BottomLeft className="w-6 h-6" />
      </button>

      {/* Breadcrumbs + Title */}
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-[var(--text-color)]">
          {crumbs[crumbs.length - 1] || "Dashboard"}
        </h1>
        <div className="text-xs text-gray-500">
          Home {crumbs.map((c, i) => ` / ${c}`)}
        </div>
        <span className="text-xs text-gray-500">
          Logged in as <strong>Store Manager</strong>
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)}>
            <IoNotificationsOutline className="text-xl text-gray-600" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              3
            </span>
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-20">
              <p className="px-4 py-2 text-sm font-semibold border-b">
                Notifications
              </p>
              <div className="max-h-40 overflow-y-auto">
                <p className="px-4 py-2 text-sm hover:bg-gray-100">
                  New issue created
                </p>
                <p className="px-4 py-2 text-sm hover:bg-gray-100">
                  Stock updated
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            className="flex items-center space-x-2"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border-2 border-[var(--primary-color)]"
            />
            <span className="text-sm font-medium text-[var(--text-color)] hidden md:inline">
              Raj
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FaUserCircle className="inline mr-2" /> Profile
              </Link>
              <button
                onClick={() => alert("Logging out...")}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
              >
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
