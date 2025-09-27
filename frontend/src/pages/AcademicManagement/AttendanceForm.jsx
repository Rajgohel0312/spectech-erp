import { useState } from "react";

export default function AttendanceForm({ facultyCourses, facultyName, onAddRecord }) {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [attendance, setAttendance] = useState({});

  const selectedCourse = facultyCourses.find(
    ({ course }) => course.id === Number(selectedCourseId)
  );

  const handleToggle = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSubmit = () => {
    if (!selectedCourse || !date || !time) {
      alert("Please select course, date, and time.");
      return;
    }

    const presentStudents = Object.keys(attendance).filter(
      (id) => attendance[id]
    );

    const record = {
      id: Date.now(),
      faculty: facultyName,
      course: selectedCourse.course,
      dept: selectedCourse.dept,
      sem: selectedCourse.sem,
      date,
      time,
      presentStudents,
      total: selectedCourse.sem.students.length,
      students: selectedCourse.sem.students,
    };

    onAddRecord(record);

    // Reset form
    setAttendance({});
    setDate("");
    setTime("");
    setSelectedCourseId("");

    alert("Attendance submitted!");
  };

  return (
    <div className="mb-8">
      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          className="border p-2 rounded bg-white"
          value={selectedCourseId}
          onChange={(e) => {
            setSelectedCourseId(e.target.value);
            setAttendance({});
          }}
        >
          <option value="">Select Course</option>
          {facultyCourses.map(({ course, sem, dept }) => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.title} ({sem.name}, {dept.name})
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 rounded bg-white"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="time"
          className="border p-2 rounded bg-white"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      {/* Attendance Table */}
      {selectedCourse && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold text-lg mb-3">
            {selectedCourse.course.code} - {selectedCourse.course.title} (
            {selectedCourse.sem.name}, {selectedCourse.dept.name})
          </h2>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Roll No</th>
                <th className="p-2">Name</th>
                <th className="p-2">Present</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourse.sem.students.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="p-2">{s.rollNo}</td>
                  <td className="p-2">{s.name}</td>
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={attendance[s.id] || false}
                      onChange={() => handleToggle(s.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-[var(--primary-color)] text-white rounded hover:opacity-90"
          >
            Submit Attendance
          </button>
        </div>
      )}
    </div>
  );
}
