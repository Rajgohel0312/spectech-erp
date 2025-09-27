import { FaUsers, FaCalendarAlt, FaClipboardList } from "react-icons/fa";
import StatCard from "../../../components/StatCard/StatCard";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function EmployeeDashboard() {
  // Fake data for demo (later fetch from API)
  const myLeaves = 5;
  const remainingLeaves = 12;
  const tasksCompleted = 48;

  // Sample leave history for chart
  const leaveHistory = [
    { month: "Jan", leaves: 1 },
    { month: "Feb", leaves: 0 },
    { month: "Mar", leaves: 2 },
    { month: "Apr", leaves: 1 },
    { month: "May", leaves: 0 },
    { month: "Jun", leaves: 1 },
  ];

  return (
    <div className="p-6 min-h-screen bg-[var(--background-color)] space-y-8">
      <h1 className="text-2xl font-bold">Employee Dashboard</h1>

      {/* ====== Stat Cards ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          icon={<FaCalendarAlt />}
          label="Leaves Taken"
          value={myLeaves}
          color="text-[var(--primary-color)]"
        />
        <StatCard
          icon={<FaClipboardList />}
          label="Remaining Leaves"
          value={remainingLeaves}
          color="text-green-500"
        />
        <StatCard
          icon={<FaUsers />}
          label="Tasks Completed"
          value={tasksCompleted}
          color="text-blue-500"
        />
      </div>

      {/* ====== Leave History Chart ====== */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Leave History (Last 6 Months)
        </h2>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <LineChart data={leaveHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="leaves" stroke="#52a4b0" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ====== Profile Info ====== */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">My Profile</h2>
        <ul className="space-y-2 text-gray-700">
          <li><strong>Name:</strong> Raj Patel</li>
          <li><strong>Department:</strong> Computer Science</li>
          <li><strong>Position:</strong> Assistant Professor</li>
          <li><strong>Email:</strong> raj.patel@example.com</li>
        </ul>
      </div>
    </div>
  );
}
