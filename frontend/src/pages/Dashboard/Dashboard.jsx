import { FaBox, FaFlask, FaExclamationTriangle } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StatCard from "../../components/StatCard/StatCard";
import { mockAcademicData } from "../../data/mockAcademicData";
import { useEffect, useState } from "react";

const COLORS = [
  "#52a4b0",
  "#facc15",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
  "#34d399",
  "#f97316",
];

export default function Dashboard() {
  // ======== Derived Stats =========
  let totalStudents = 0;
  let totalCourses = 0;
  let totalExams = 0;

  const collegeStats = mockAcademicData.map((college) => {
    let collegeStudents = 0;
    let collegeCourses = 0;
    let collegeExams = 0;

    college.departments.forEach((dept) => {
      dept.semesters.forEach((sem) => {
        collegeStudents += sem.students.length;
        collegeCourses += sem.courses.length;
        collegeExams += sem.exams.length;
      });
    });

    totalStudents += collegeStudents;
    totalCourses += collegeCourses;
    totalExams += collegeExams;

    return {
      name: college.name,
      value: collegeStudents,
    };
  });

  // ======== Attendance Stats =========
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    setRecords(saved);
  }, []);

  // Aggregate attendance per department
  const deptStats = {};
  const lowAttendance = {}; // track per student

  records.forEach((rec) => {
    const key = rec.deptName;
    if (!deptStats[key]) {
      deptStats[key] = { total: 0, present: 0 };
    }
    deptStats[key].total += rec.total;
    deptStats[key].present += rec.presentStudents.length;

    // calculate per student
    rec.semStudents?.forEach((s) => {
      if (!lowAttendance[s.id]) {
        lowAttendance[s.id] = { student: s, total: 0, present: 0 };
      }
      lowAttendance[s.id].total++;
      if (rec.presentStudents.includes(String(s.id))) {
        lowAttendance[s.id].present++;
      }
    });
  });

  const deptChartData = Object.keys(deptStats).map((dept) => ({
    name: dept,
    value: (
      (deptStats[dept].present / deptStats[dept].total) *
      100
    ).toFixed(1),
  }));

  const atRiskStudents = Object.values(lowAttendance).filter((s) => {
    const percent = (s.present / s.total) * 100;
    return percent < 75;
  });

  return (
    <div className="p-6 bg-[var(--background-color)] min-h-screen space-y-6">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-[var(--text-color)]">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<FaBox />}
          label="Total Students"
          value={totalStudents.toLocaleString()}
          color="text-[var(--primary-color)]"
        />
        <StatCard
          icon={<FaFlask />}
          label="Total Courses"
          value={totalCourses.toLocaleString()}
          color="text-blue-500"
        />
        <StatCard
          icon={<FaExclamationTriangle />}
          label="Total Exams"
          value={totalExams.toLocaleString()}
          color="text-red-500"
        />
      </div>

      {/* Students per College Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Students per College
        </h2>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={collegeStats}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {collegeStats.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Summary */}
      {records.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Department Attendance %
          </h2>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={deptChartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {deptChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Low Attendance Students */}
      {atRiskStudents.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">⚠️ Students Below 75%</h2>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Roll No</th>
                <th className="p-2">Name</th>
                <th className="p-2">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.map((s) => {
                const percent = ((s.present / s.total) * 100).toFixed(1);
                return (
                  <tr key={s.student.id} className="border-b">
                    <td className="p-2">{s.student.rollNo}</td>
                    <td className="p-2">{s.student.name}</td>
                    <td className="p-2 text-red-600 font-semibold">
                      {percent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
