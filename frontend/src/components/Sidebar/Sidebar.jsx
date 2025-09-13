import { Link, useLocation } from "react-router-dom";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi2";
import { IoCloseSharp } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { menuConfig } from "../../config/menuConfig";

export default function Sidebar({ sidebarOpen, setSidebarOpen, collapsed, setCollapsed }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`fixed md:relative z-40 inset-y-0 left-0 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-all duration-300 ease-in-out 
      ${collapsed ? "md:w-20" : "md:w-64"} w-64 
      bg-[var(--secondary-color)] shadow-lg flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        {!collapsed && (
          <span className="font-bold text-[var(--text-color)]">Spectech</span>
        )}

        {/* Mobile close */}
        <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
          <IoCloseSharp className="w-6 h-6" />
        </button>

        {/* Desktop collapse */}
        <button
          className="hidden md:block text-gray-600 hover:text-[var(--primary-color)]"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <HiChevronDoubleRight className="w-5 h-5" />
          ) : (
            <HiChevronDoubleLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-grow px-2 py-4 overflow-y-auto space-y-4">
        {menuConfig.map((section, idx) => (
          <div key={idx}>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.links.map((link, i) => (
                <Link
                  key={i}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg relative transition-all duration-200
                    ${isActive(link.path)
                      ? "bg-[var(--primary-color)] text-white"
                      : "hover:bg-[var(--primary-color)] hover:text-white"
                    }`}
                  title={collapsed ? link.label : ""}
                >
                  {/* Active link indicator bar */}
                  {isActive(link.path) && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary-color)] rounded-r-md"></span>
                  )}

                  <span className="text-lg">{link.icon}</span>
                  {!collapsed && link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="px-3 py-3 border-t border-gray-200">
        <button
          onClick={() => alert("Logging out...")}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 rounded-lg transition"
          title={collapsed ? "Logout" : ""}
        >
          <FaSignOutAlt className="w-4 h-4" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}
