import { FaTachometerAlt, FaFlask, FaHistory } from "react-icons/fa";
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
