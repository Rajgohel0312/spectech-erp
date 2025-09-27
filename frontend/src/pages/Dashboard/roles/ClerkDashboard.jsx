import { FaUsers, FaFileAlt } from "react-icons/fa";
import StatCard from "../../../components/StatCard/StatCard";

export default function ClerkDashboard() {
  const leavesThisMonth = 25;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Clerk Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard icon={<FaUsers />} label="Leave Requests" value={leavesThisMonth} color="text-[var(--primary-color)]" />
        <StatCard icon={<FaFileAlt />} label="CSV Uploads" value="Enabled" color="text-blue-500" />
      </div>
    </div>
  );
}
