import { useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaBook,
  FaClipboardList,
  FaUsers,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import StatCard from "../../../components/StatCard/StatCard";
import api from "../../../utils/api";

const COLORS = [
  "#52a4b0",
  "#facc15",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
  "#34d399",
  "#f97316",
];

export default function AdminDashboard() {
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCol = await api.get("/colleges");
        const resDept = await api.get("/departments");
        setColleges(resCol.data);
        setDepartments(resDept.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };
    fetchData();
  }, []);

  // ====== Totals ======
  const totalColleges = colleges.length;
  const totalDepartments = departments.length;
  // later replace with student & course APIs
  const totalStudents = 0;
  const totalCourses = 0;
  const totalExams = 0;

  // ====== Students per College Pie Chart ======
  const collegeStats = colleges.map((c) => ({
    name: c.name,
    students: c.total_students || 0, // backend should send student count later
  }));

  // ====== Departments per College Bar Chart ======
  const deptStats = colleges.map((c) => ({
    name: c.name,
    departments: departments.filter((d) => d.college_id === c.id).length,
  }));

  return (
    <div className="p-6 min-h-screen bg-[var(--background-color)] space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* ====== Stat Cards ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaUsers />}
          label="Colleges"
          value={totalColleges}
          color="text-green-600"
        />
        <StatCard
          icon={<FaUsers />}
          label="Departments"
          value={totalDepartments}
          color="text-green-500"
        />
        <StatCard
          icon={<FaUserGraduate />}
          label="Total Students"
          value={totalStudents}
          color="text-[var(--primary-color)]"
        />
        <StatCard
          icon={<FaBook />}
          label="Total Courses"
          value={totalCourses}
          color="text-blue-500"
        />
        <StatCard
          icon={<FaClipboardList />}
          label="Total Exams"
          value={totalExams}
          color="text-red-500"
        />
      </div>

      {/* ====== Students per College Pie Chart ====== */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Students per College
        </h2>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={collegeStats}
                dataKey="students"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {collegeStats.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ====== Departments per College Bar Chart ====== */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Departments per College
        </h2>
        <div className="w-full h-96">
          <ResponsiveContainer>
            <BarChart data={deptStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="departments" fill="#52a4b0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
