import { FaFlask, FaHistory, FaFileInvoice } from "react-icons/fa";
import StatCard from "../../../components/StatCard/StatCard";

export default function LabAssistantDashboard() {
  const stockItems = 250;
  const issues = 120;
  const lowStock = 10;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Lab Assistant Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard icon={<FaFlask />} label="Stock Items" value={stockItems} color="text-blue-500" />
        <StatCard icon={<FaHistory />} label="Issues Recorded" value={issues} color="text-[var(--primary-color)]" />
        <StatCard icon={<FaFileInvoice />} label="Low Stock" value={lowStock} color="text-red-500" />
      </div>
    </div>
  );
}
