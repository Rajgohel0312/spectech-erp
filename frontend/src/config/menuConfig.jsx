import {
  FaTachometerAlt,
  FaFlask,
  FaHistory,
  FaFileInvoice,
} from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

export const menuConfig = [
  {
    section: "Main",
    links: [{ path: "/", label: "Dashboard", icon: <FaTachometerAlt /> }],
  },
  {
    section: "Management",
    links: [
      { path: "/product-master", label: "Product Master", icon: <FaFlask /> },
      { path: "/issue-history", label: "Issue History", icon: <FaHistory /> },
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
