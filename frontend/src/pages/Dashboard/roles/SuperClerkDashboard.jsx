import { FaUsers, FaFileAlt } from "react-icons/fa";
import StatCard from "../../../components/StatCard/StatCard";

export default function SuperClerkDashboard() {
  const totalLeaves = 120;
  const colleges = 7;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Super Clerk Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard icon={<FaUsers />} label="Total Leave Requests" value={totalLeaves} color="text-red-500" />
        <StatCard icon={<FaFileAlt />} label="Colleges Managed" value={colleges} color="text-green-500" />
      </div>
    </div>
  );
}
