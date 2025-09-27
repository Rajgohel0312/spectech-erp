import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

export default function AdminAttendanceSummary() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    setRecords(saved);
  }, []);

  // 🔹 Aggregate by department
  const deptStats = {};
  const lowAttendanceStudents = new Set();

  records.forEach((rec) => {
    const key = rec.deptName;
    if (!deptStats[key]) {
      deptStats[key] = { total: 0, present: 0 };
    }
    deptStats[key].total += rec.total;
    deptStats[key].present += rec.presentStudents.length;

    // track low attendance (below 75%)
    rec.semStudents?.forEach((s) => {
      const attended = rec.presentStudents.includes(String(s.id));
      if (!attended) {
        // skip absent counts (optional enhancement)
      }
    });
  });

  const chartData = Object.keys(deptStats).map((dept) => ({
    name: dept,
    value: (
      (deptStats[dept].present / deptStats[dept].total) *
      100
    ).toFixed(1),
  }));

  const COLORS = ["#52a4b0", "#facc15", "#60a5fa", "#a78bfa", "#f87171"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <h2 className="text-lg font-semibold mb-4 text-center">
        📊 Department-wise Attendance Summary
      </h2>
      <div className="w-full h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
