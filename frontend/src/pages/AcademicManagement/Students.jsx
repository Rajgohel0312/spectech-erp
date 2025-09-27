import { useMemo, useState } from "react";
import { mockAcademicData } from "../../data/mockAcademicData";
import { getStudentData, promoteSemester } from "../../utils/academicUtils";

export default function Students({ userRole, userId, facultyDeptId }) {
  const [colleges, setColleges] = useState(mockAcademicData);

  // Student → show only own profile
  if (userRole === "student") {
    const studentData = getStudentData(userId, mockAcademicData);
    if (!studentData) return <div className="p-6">No student record found</div>;

    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">My Profile</h1>
        <div className="bg-white p-4 rounded shadow">
          <p><strong>Name:</strong> {studentData.student.name}</p>
          <p><strong>Roll No:</strong> {studentData.student.rollNo}</p>
          <p><strong>Email:</strong> {studentData.student.email}</p>
          <p><strong>Department:</strong> {studentData.dept.name}</p>
          <p><strong>Semester:</strong> {studentData.sem.name}</p>
        </div>
      </div>
    );
  }

  // Only Admin / Faculty can manage student lists
  if (!["admin", "faculty"].includes(userRole)) {
    return <div className="p-6">🚫 Access Denied</div>;
  }

  // Filters
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedSemId, setSelectedSemId] = useState("");
  const [search, setSearch] = useState("");

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

  const allStudents = selectedSem?.students ?? [];
  const filteredStudents = allStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  // Promote Semester handler
  const handlePromote = () => {
    if (!selectedCollegeId || !selectedDeptId || !selectedSemId) {
      alert("Please select College, Department, and Semester first.");
      return;
    }

    const updated = [...colleges];
    promoteSemester(Number(selectedCollegeId), Number(selectedDeptId), Number(selectedSemId), updated);
    setColleges(updated);

    alert("Semester promoted successfully!");
  };

  return (
    <div className="p-6 min-h-screen bg-[var(--background-color)]">
      <h1 className="text-xl font-bold mb-4">Students</h1>

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

      {/* Promote Button (only Faculty & Admin) */}
      {selectedSem && (
        <button
          onClick={handlePromote}
          className="mb-4 px-4 py-2 bg-[var(--primary-color)] text-white rounded hover:opacity-90"
        >
          Promote Entire Semester
        </button>
      )}

      {/* Search */}
      {selectedSem && (
        <input
          placeholder="Search by name or roll no"
          className="border p-2 mb-4 w-full max-w-md rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Roll No</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{s.rollNo}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.email}</td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td className="p-3 text-gray-400" colSpan={3}>
                  {selectedSem
                    ? "No students found."
                    : "Select College, Department, and Semester to view students."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
