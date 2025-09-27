import { useEffect, useState } from "react";

export default function MyAttendance({ userRole, studentRollNo }) {
  if (userRole !== "student") {
    return <div className="p-6">🚫 Only students can view this page</div>;
  }

  const [records, setRecords] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    setRecords(saved);
  }, []);

  const courses = {};
  records.forEach((rec) => {
    const key = rec.course.code;
    if (!courses[key]) {
      courses[key] = { total: 0, present: 0, title: rec.course.title };
    }
    courses[key].total++;
    if (rec.presentStudents.includes(studentRollNo)) {
      courses[key].present++;
    }
  });

  return (
    <div className="p-6 min-h-screen bg-[var(--background-color)]">
      <h1 className="text-xl font-bold mb-4">📊 My Attendance</h1>

      {Object.keys(courses).length === 0 ? (
        <p className="text-gray-500">No attendance records yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(courses).map((code) => {
            const c = courses[code];
            const percent = ((c.present / c.total) * 100).toFixed(1);
            return (
              <div
                key={code}
                className={`p-4 rounded shadow ${
                  percent < 75 ? "bg-red-100" : "bg-green-100"
                }`}
              >
                <h2 className="font-semibold">
                  {code} - {c.title}
                </h2>
                <p>
                  {c.present} / {c.total} →{" "}
                  <span
                    className={
                      percent < 75
                        ? "text-red-600 font-bold"
                        : "text-green-600 font-bold"
                    }
                  >
                    {percent}%
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
