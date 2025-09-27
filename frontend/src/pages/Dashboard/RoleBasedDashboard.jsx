import AdminDashboard from "./roles/AdminDashboard";
import FacultyDashboard from "./roles/FacultyDashboard";
import StudentDashboard from "./roles/StudentDashboard";
import ClerkDashboard from "./roles/ClerkDashboard";
import SuperClerkDashboard from "./roles/SuperClerkDashboard";
import EmployeeDashboard from "./roles/EmployeeDashboard";
import LabAssistantDashboard from "./roles/LabAssistantDashboard";
import StoreDashboard from "./roles/StoreDashboard";

export default function RoleBasedDashboard({ userRole }) {
  switch (userRole) {
    case "admin":
      return <AdminDashboard />;
    case "faculty":
      return <FacultyDashboard />;
    case "student":
      return <StudentDashboard />;
    case "clerk":
      return <ClerkDashboard />;
    case "superClerk":
      return <SuperClerkDashboard />;
    case "employee":
      return <EmployeeDashboard />;
    case "labAssistant":
      return <LabAssistantDashboard />;
    case "store":
      return <StoreDashboard />;
    default:
      return <div className="p-6">🚫 No dashboard available for this role</div>;
  }
}
