import { useMemo, useState } from "react";
import { mockAcademicData } from "../../data/mockAcademicData";
import { getStudentData } from "../../utils/academicUtils";

export default function Courses({ userRole, userId, facultyDeptId }) {
  const [colleges] = useState(mockAcademicData);

  // Student → only their sem courses
  if (userRole === "student") {
    const studentData = getStudentData(userId, mockAcademicData);
    if (!studentData) return <div>No courses found</div>;

    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">My Courses</h1>
        <ul className="bg-white rounded shadow divide-y">
          {studentData.sem.courses.map((c) => (
            <li key={c.id} className="p-3">
              {c.code} - {c.title} ({c.credit} credits)
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!["admin", "faculty"].includes(userRole)) {
    return <div className="p-6">🚫 Access Denied</div>;
  }

  // Filters
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedSemId, setSelectedSemId] = useState("");

  const selectedCollege = useMemo(
    () => colleges.find((c) => c.id === Number(selectedCollegeId)),
    [colleges, selectedCollegeId]
  );
  const selectedDept = useMemo(
    () => selectedCollege?.departments.find((d) => d.id === Number(selectedDeptId)),
    [selectedCollege, selectedDeptId]
  );
  const selectedSem = useMemo(
    () => selectedDept?.semesters.find((s) => s.id === Number(selectedSemId)),
    [selectedDept, selectedSemId]
  );

  const allCourses = selectedSem?.courses ?? [];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Courses</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <select
          className="border p-2 rounded bg-white"
          value={selectedCollegeId}
          onChange={(e) => {
            setSelectedCollegeId(e.target.value);
            setSelectedDeptId("");
            setSelectedSemId("");
          }}
        >
          <option value="">Select College</option>
          {colleges.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded bg-white"
          value={selectedDeptId}
          onChange={(e) => {
            setSelectedDeptId(e.target.value);
            setSelectedSemId("");
          }}
          disabled={!selectedCollege}
        >
          <option value="">Select Department</option>
          {selectedCollege?.departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded bg-white"
          value={selectedSemId}
          onChange={(e) => setSelectedSemId(e.target.value)}
          disabled={!selectedDept}
        >
          <option value="">Select Semester</option>
          {selectedDept?.semesters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Code</th>
              <th className="p-3">Title</th>
              <th className="p-3">Credits</th>
              <th className="p-3">Faculty</th>
            </tr>
          </thead>
          <tbody>
            {allCourses.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{c.code}</td>
                <td className="p-3">{c.title}</td>
                <td className="p-3">{c.credit}</td>
                <td className="p-3">{c.faculty}</td>
              </tr>
            ))}
            {allCourses.length === 0 && (
              <tr>
                <td className="p-3 text-gray-400" colSpan={4}>
                  Select filters to view courses
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
