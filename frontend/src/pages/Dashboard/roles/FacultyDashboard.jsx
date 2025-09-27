import { FaUserGraduate, FaBook, FaClipboardList } from "react-icons/fa";
import { mockAcademicData } from "../../../data/mockAcademicData";
import StatCard from "../../../components/StatCard/StatCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function FacultyDashboard() {
  // Example: Faculty belongs to "Computer Science" dept
  const dept = mockAcademicData[0].departments.find((d) => d.name === "Computer Science");

  let students = 0, courses = 0, exams = 0;
  dept.semesters.forEach((sem) => {
    students += sem.students.length;
    courses += sem.courses.length;
    exams += sem.exams.length;
  });

  const semStats = dept.semesters.map((sem) => ({
    name: sem.name,
    students: sem.students.length,
  }));

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Faculty Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard icon={<FaUserGraduate />} label="Students" value={students} color="text-[var(--primary-color)]" />
        <StatCard icon={<FaBook />} label="Courses" value={courses} color="text-blue-500" />
        <StatCard icon={<FaClipboardList />} label="Exams" value={exams} color="text-red-500" />
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Students per Semester</h2>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <BarChart data={semStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#52a4b0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
