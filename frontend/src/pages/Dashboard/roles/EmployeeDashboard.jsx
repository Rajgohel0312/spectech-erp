import { useState, useEffect } from "react";
import axios from "axios";
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
  const [myLeaves, setMyLeaves] = useState(0);
  const [remainingLeaves, setRemainingLeaves] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState({ CL: 0, SL: 0, VL: 0 });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Profile
        const profileRes = await axios.get("http://localhost:8000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data);

        // Leave history
        const leavesRes = await axios.get(
          "http://localhost:8000/api/leaves/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const leaves = leavesRes.data;
        setMyLeaves(leaves.length);

        // Group leaves by month
        const monthMap = {};
        leaves.forEach((l) => {
          const month = new Date(l.start_date).toLocaleString("default", {
            month: "short",
          });
          monthMap[month] = (monthMap[month] || 0) + 1;
        });
        const chartData = Object.keys(monthMap).map((m) => ({
          month: m,
          leaves: monthMap[m],
        }));
        setLeaveHistory(chartData);

        // Balances
        const balanceRes = await axios.get(
          "http://localhost:8000/api/leave-balance",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBalances({
          CL: balanceRes.data.cl,
          SL: balanceRes.data.sl,
          VL: balanceRes.data.vl,
        });

        // Remaining = sum of balances
        setRemainingLeaves(
          balanceRes.data.cl + balanceRes.data.sl + balanceRes.data.vl
        );

        // Placeholder tasks
        setTasksCompleted(48);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 min-h-screen bg-[var(--background-color)] space-y-8">
      <h1 className="text-2xl font-bold">Employee Dashboard</h1>

      {/* Stats */}
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

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Leave History (Monthly)
        </h2>
        {leaveHistory.length > 0 ? (
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
        ) : (
          <p className="text-gray-500 text-center">No leave data yet.</p>
        )}
      </div>

      {/* Balances */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">My Leave Balance</h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>Casual Leave (CL):</strong> {balances.CL}
          </li>
          <li>
            <strong>Sick Leave (SL):</strong> {balances.SL}
          </li>
          <li>
            <strong>Vacation Leave (VL):</strong> {balances.VL}
          </li>
        </ul>
      </div>

      {/* Profile */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">My Profile</h2>
        {profile ? (
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>Name:</strong> {profile.name}
            </li>
            <li>
              <strong>Department:</strong> {profile.department || "N/A"}
            </li>
            <li>
              <strong>Role:</strong> {profile.roles?.[0]?.name || profile.role}
            </li>
            <li>
              <strong>Email:</strong> {profile.email}
            </li>
          </ul>
        ) : (
          <p>No profile data found.</p>
        )}
      </div>
    </div>
  );
}
