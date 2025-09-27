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
  LineChart,
  Line,
} from "recharts";
import StatCard from "../../../components/StatCard/StatCard";
import { mockAcademicData } from "../../../data/mockAcademicData";

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
  let totalStudents = 0,
    totalCourses = 0,
    totalExams = 0,
    totalDepartments = 0;

  // ====== Collect Stats ======
  const collegeStats = mockAcademicData.map((college) => {
    let collegeStudents = 0,
      collegeCourses = 0,
      collegeExams = 0;

    college.departments.forEach((dept) => {
      totalDepartments++;
      dept.semesters.forEach((sem) => {
        totalStudents += sem.students.length;
        totalCourses += sem.courses.length;
        totalExams += sem.exams.length;

        collegeStudents += sem.students.length;
        collegeCourses += sem.courses.length;
        collegeExams += sem.exams.length;
      });
    });

    return {
      name: college.name,
      students: collegeStudents,
      courses: collegeCourses,
      exams: collegeExams,
    };
  });

  // ====== Department Level Data ======
  const deptStats = [];
  mockAcademicData.forEach((college) => {
    college.departments.forEach((dept) => {
      let deptStudents = 0;
      dept.semesters.forEach((sem) => {
        deptStudents += sem.students.length;
      });
      deptStats.push({
        name: `${college.name.split(" ")[0]} - ${dept.name}`,
        students: deptStudents,
      });
    });
  });

  // ====== Exams per Month (fake month distribution) ======
  const examsPerMonth = [
    { month: "Jan", exams: 12 },
    { month: "Feb", exams: 18 },
    { month: "Mar", exams: 25 },
    { month: "Apr", exams: 15 },
    { month: "May", exams: 20 },
    { month: "Jun", exams: 10 },
  ];

  // ====== Top 5 Colleges ======
  const topColleges = [...collegeStats]
    .sort((a, b) => b.students - a.students)
    .slice(0, 5);

  // ====== Upcoming Exams ====== (flatten first, then pick top 5 earliest)
  let upcomingExams = [];
  mockAcademicData.forEach((college) =>
    college.departments.forEach((dept) =>
      dept.semesters.forEach((sem) => {
        upcomingExams.push(...sem.exams);
      })
    )
  );
  upcomingExams = upcomingExams.slice(0, 5);

  return (
    <div className="p-6 min-h-screen bg-[var(--background-color)] space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* ====== Stat Cards ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <StatCard
          icon={<FaUsers />}
          label="Departments"
          value={totalDepartments}
          color="text-green-500"
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

      {/* ====== Department Students Bar Chart ====== */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Students per Department
        </h2>
        <div className="w-full h-96">
          <ResponsiveContainer>
            <BarChart data={deptStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#52a4b0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ====== Exams per Month Line Chart ====== */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Exams per Month
        </h2>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <LineChart data={examsPerMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="exams" stroke="#a78bfa" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ====== Summary Tables ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Colleges */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Top 5 Colleges by Students
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">College</th>
                <th className="p-3">Students</th>
              </tr>
            </thead>
            <tbody>
              {topColleges.map((c, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Upcoming Exams</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Course</th>
                <th className="p-3">Date</th>
                <th className="p-3">Room</th>
              </tr>
            </thead>
            <tbody>
              {upcomingExams.map((exam, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3">{exam.course}</td>
                  <td className="p-3">{exam.date}</td>
                  <td className="p-3">{exam.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
