import {
  FaUserGraduate,
  FaBook,
  FaClipboardList,
  FaUsers,
  FaFileAlt,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { FaFlask, FaHistory, FaFileInvoice } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

export const menuConfig = [
  {
    section: "Main",
    links: [
      {
        path: "/",
        label: "Dashboard",
        icon: <MdSchool />,
        roles: [
          "admin",
          "faculty",
          "student",
          "labAssistant",
          "clerk",
          "employee",
          "superClerk",
          "store",
          "accountant",
          "superAccountant",
        ],
      },
    ],
  },

  {
    section: "Academic Management",
    links: [
      {
        path: "/academic/students",
        label: "Students",
        icon: <FaUserGraduate />,
        roles: ["admin", "faculty"],
      },
      {
        path: "/academic/courses",
        label: "Courses",
        icon: <FaBook />,
        roles: ["admin", "faculty", "student"],
      },
      {
        path: "/academic/exams",
        label: "Exams",
        icon: <FaClipboardList />,
        roles: ["admin", "faculty", "student"],
      },
      {
        path: "/academic/attendance",
        label: "Attendance",
        icon: <FaClipboardList />,
        roles: ["faculty"], // only faculty can see it
      },
      {
        path: "/academic/my-attendance",
        label: "My Attendance",
        icon: <FaCalendarAlt />, // ✅ use calendar icon
        roles: ["student"], // ✅ only students see it
      },
    ],
  },
  {
    section: "Store Management",
    links: [
      {
        path: "/product-master",
        label: "Product Master",
        icon: <FaFlask />,
        roles: ["admin", "labAssistant", "store"],
      },
      {
        path: "/issue-history",
        label: "Issue History",
        icon: <FaHistory />,
        roles: ["admin", "labAssistant", "store"],
      },
      {
        path: "/store/purchase-orders",
        label: "Purchase Order",
        icon: <FaFileInvoice />,
        roles: ["admin", "labAssistant", "store"],
      },
    ],
  },

  {
    section: "HR & Payroll",
    links: [
      {
        path: "/leave-management",
        label: "Leave Management (All Colleges)",
        icon: <FaUsers />,
        roles: ["superClerk"],
      },
      {
        path: "/reports",
        label: "Reports",
        icon: <FaFileAlt />,
        roles: ["superClerk"],
      },
      {
        path: "/hr-settings",
        label: "HR Settings",
        icon: <IoSettingsOutline />,
        roles: ["superClerk"],
      },
      {
        path: "/leave-management",
        label: "Leave Management (My College)",
        icon: <FaUsers />,
        roles: ["clerk"],
      },
      {
        path: "/leave-upload",
        label: "Upload CSV",
        icon: <FaFileAlt />,
        roles: ["clerk"],
      },
      {
        path: "/leave-management",
        label: "My Leaves",
        icon: <FaCalendarAlt />,
        roles: ["employee"],
      },
      {
        path: "/profile",
        label: "Profile",
        icon: <FaUsers />,
        roles: ["employee"],
      },
    ],
  },
  {
    section: "Finance & Fees",
    links: [
      {
        path: "/finance/fee-structure",
        label: "Fee Structure",
        icon: <FaFileInvoiceDollar />,
        roles: ["superAccountant"],
      },
      {
        path: "/finance/payments",
        label: "Payments",
        icon: <FaFileAlt />,
        roles: ["accountant", "superAccountant", "clerk"],
      },
      {
        path: "/finance/pending",
        label: "Pending Fees",
        icon: <FaExclamationTriangle />,
        roles: ["accountant", "superAccountant"],
      },
      {
        path: "/finance/reports",
        label: "Reports",
        icon: <FaClipboardList />,
        roles: ["superAccountant"],
      },
      {
        path: "/finance/my-fees",
        label: "My Fees",
        icon: <FaFileInvoice />,
        roles: ["student"],
      },
      {
        path: "/finance/my-receipts",
        label: "My Receipts",
        icon: <FaFileAlt />,
        roles: ["student"],
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
        roles: ["admin", "store"],
      },
    ],
  },
];
