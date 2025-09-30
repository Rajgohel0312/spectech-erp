import AdminDashboard from "./roles/AdminDashboard";
import FacultyDashboard from "./roles/FacultyDashboard";
import StudentDashboard from "./roles/StudentDashboard";
import ClerkDashboard from "./roles/ClerkDashboard";
import SuperClerkDashboard from "./roles/SuperClerkDashboard";
import EmployeeDashboard from "./roles/EmployeeDashboard";
import LabAssistantDashboard from "./roles/LabAssistantDashboard";
import StoreDashboard from "./roles/StoreDashboard";
import SuperAccountantDashboard from "./SuperAccountantDashboard";
import AccountantDashboard from "./AccountantDashboard";

export default function RoleBasedDashboard({ userRole }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = typeof userRole === "object" ? userRole.name : userRole;

  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "faculty":
      return <FacultyDashboard />;
    case "student":
      return <StudentDashboard />;
    case "clerk":
      return <ClerkDashboard collegeName={user?.college?.name || null} />;
    case "superClerk":
      return <SuperClerkDashboard />;
    case "employee":
      return <EmployeeDashboard />;
    case "labAssistant":
      return <LabAssistantDashboard />;
    case "store":
      return <StoreDashboard />;
    case "superAccountant":
      return <SuperAccountantDashboard />;
    case "accountant":
      return <AccountantDashboard collegeName={user?.college?.name} />;
    default:
      return <div className="p-6">🚫 No dashboard available for this role</div>;
  }
}
