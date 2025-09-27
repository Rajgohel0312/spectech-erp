import { mockAcademicData } from "../../data/mockAcademicData";

function getStudentsByDeptSem(deptId, semId) {
  const dept = mockAcademicData
    .flatMap((c) => c.departments)
    .find((d) => d.id === deptId);

  return dept?.semesters.find((s) => s.id === semId)?.students || [];
}

export default function AttendanceModal({ record, onClose }) {
  const students = getStudentsByDeptSem(record.deptId, record.semId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {record.course.code} - {record.course.title}
            <br />
            <span className="text-sm text-gray-500">
              {record.date} {record.time} | {record.semName} ({record.deptName})
            </span>
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Roll No</th>
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-2">{s.rollNo}</td>
                <td className="p-2">{s.name}</td>
                <td className="p-2">
                  {record.presentStudents.includes(String(s.id))
                    ? "✅ Present"
                    : "❌ Absent"}
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={3} className="p-3 text-gray-500 text-center">
                  ⚠️ No students found for this record
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
