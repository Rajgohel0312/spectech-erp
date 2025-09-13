import { FaBox, FaFlask, FaExclamationTriangle } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StatCard from "../components/StatCard/StatCard";

const data = [
  { name: "Dept A", value: 40 },
  { name: "Dept B", value: 30 },
  { name: "Dept C", value: 20 },
  { name: "Dept D", value: 10 },
];

const COLORS = ["#52a4b0", "#facc15", "#60a5fa", "#a78bfa"];

export default function Dashboard() {
  return (
    <div className="p-6 bg-[var(--background-color)] min-h-screen space-y-6">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-[var(--text-color)]">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<FaBox />} label="Total Stock" value="200+" color="text-[var(--primary-color)]" />
        <StatCard icon={<FaFlask />} label="Issued Chemicals" value="120+" color="text-blue-500" />
        <StatCard icon={<FaExclamationTriangle />} label="Low Stock" value="8" color="text-red-500" />
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-[var(--text-color)] text-center">
          Department Usage
        </h2>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
