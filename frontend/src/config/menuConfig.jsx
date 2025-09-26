import {
  FaTachometerAlt,
  FaFlask,
  FaHistory,
  FaFileInvoice,
  FaUsers,
  FaFileAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

// ✅ role-based config
export const menuConfig = (userRole) => {
  // Super Clerk
  if (userRole === "superClerk") {
    return [
      {
        section: "Main",
        links: [{ path: "/", label: "Dashboard", icon: <FaTachometerAlt /> }],
      },
      {
        section: "HR & Payroll",
        links: [
          {
            path: "/leave-management",
            label: "Leave Management (All Colleges)",
            icon: <FaUsers />,
          },
          { path: "/reports", label: "Reports", icon: <FaFileAlt /> },
          {
            path: "/hr-settings",
            label: "HR Settings",
            icon: <IoSettingsOutline />,
          },
        ],
      },
    ];
  }

  // Clerk
  if (userRole === "clerk") {
    return [
      {
        section: "Main",
        links: [{ path: "/", label: "Dashboard", icon: <FaTachometerAlt /> }],
      },
      {
        section: "HR & Payroll",
        links: [
          {
            path: "/leave-management",
            label: "Leave Management (My College)",
            icon: <FaUsers />,
          },
          { path: "/leave-upload", label: "Upload CSV", icon: <FaFileAlt /> },
        ],
      },
    ];
  }

  // Employee
  if (userRole === "employee") {
    return [
      {
        section: "Main",
        links: [{ path: "/", label: "Dashboard", icon: <FaTachometerAlt /> }],
      },
      {
        section: "My Account",
        links: [
          {
            path: "/leave-management",
            label: "My Leaves",
            icon: <FaCalendarAlt />,
          },
          { path: "/profile", label: "Profile", icon: <FaUsers /> },
        ],
      },
    ];
  }

  // Store Manager / Lab Assistant
  if (userRole === "store") {
    return [
      {
        section: "Main",
        links: [{ path: "/", label: "Dashboard", icon: <FaTachometerAlt /> }],
      },
      {
        section: "Management",
        links: [
          {
            path: "/product-master",
            label: "Product Master",
            icon: <FaFlask />,
          },
          {
            path: "/issue-history",
            label: "Issue History",
            icon: <FaHistory />,
          },
          {
            path: "/store/purchase-orders",
            label: "Purchase Order",
            icon: <FaFileInvoice />,
          },
        ],
      },
      {
        section: "Settings",
        links: [
          {
            path: "/settings/general",
            label: "General",
            icon: <IoSettingsOutline />,
          },
        ],
      },
    ];
  }

  // Default (fallback)
  return [
    {
      section: "Main",
      links: [{ path: "/", label: "Dashboard", icon: <FaTachometerAlt /> }],
    },
  ];
};
