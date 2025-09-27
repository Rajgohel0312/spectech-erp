import { FaBook, FaClipboardList } from "react-icons/fa";
import StatCard from "../../../components/StatCard/StatCard";

export default function StudentDashboard() {
  // Fake student data (later fetch actual student info)
  const myCourses = 5;
  const myExams = 3;
  const attendance = "85%";

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard icon={<FaBook />} label="My Courses" value={myCourses} color="text-blue-500" />
        <StatCard icon={<FaClipboardList />} label="Upcoming Exams" value={myExams} color="text-red-500" />
        <StatCard icon={<FaBook />} label="Attendance" value={attendance} color="text-green-500" />
      </div>

      {/* Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Notices</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>Mid-sem exam starts next week</li>
          <li>Submit assignment for CS101 by Monday</li>
        </ul>
      </div>
    </div>
  );
}
