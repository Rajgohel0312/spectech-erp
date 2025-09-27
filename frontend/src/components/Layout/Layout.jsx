import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

export default function Layout({ userRole }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const hideSidebar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex">
      {!hideSidebar && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          userRole={userRole} // ✅ pass role to sidebar
        />
      )}

      <div className="flex-1 flex flex-col">
        {!hideSidebar && (
          <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}
        <main className="flex-1 bg-[var(--background-color)] min-h-screen">
          {/* ✅ forward role into all pages via Outlet */}
          <Outlet context={{ userRole }} />
        </main>
      </div>
    </div>
  );
}
