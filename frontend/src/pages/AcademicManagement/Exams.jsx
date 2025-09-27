import { useMemo, useState } from "react";
import { mockAcademicData } from "../../data/mockAcademicData";
import { getStudentData, getFacultyCourses } from "../../utils/academicUtils";

export default function Exams({ userRole, userId, facultyName }) {
  const [colleges] = useState(mockAcademicData);

  // Student → only their semester exams
  if (userRole === "student") {
    const studentData = getStudentData(userId, mockAcademicData);
    if (!studentData) return <div>No exams found</div>;

    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">My Exams</h1>
        <ul className="bg-white rounded shadow divide-y">
          {studentData.sem.exams.map((e) => (
            <li key={e.id} className="p-3">
              {e.course} - {e.date} ({e.time}) in {e.room}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Faculty → only exams for their subjects
  if (userRole === "faculty") {
    const facultyCourses = getFacultyCourses(facultyName, mockAcademicData);

    const exams = [];
    facultyCourses.forEach(({ sem }) => {
      exams.push(...sem.exams.filter((ex) =>
        facultyCourses.some((fc) => fc.course.id === ex.courseId)
      ));
    });

    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Exams - {facultyName}</h1>
        <ul className="bg-white rounded shadow divide-y">
          {exams.map((e) => (
            <li key={e.id} className="p-3">
              {e.course} - {e.date} ({e.time}) in {e.room}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (userRole !== "admin") {
    return <div className="p-6">🚫 Access Denied</div>;
  }

  // Admin → can use filters
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

  const allExams = selectedSem?.exams ?? [];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Exams</h1>

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

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Course</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Room</th>
            </tr>
          </thead>
          <tbody>
            {allExams.map((e) => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{e.course}</td>
                <td className="p-3">{e.date}</td>
                <td className="p-3">{e.time}</td>
                <td className="p-3">{e.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
