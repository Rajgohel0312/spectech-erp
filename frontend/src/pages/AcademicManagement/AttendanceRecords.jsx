import { useState } from "react";
import AttendanceModal from "./AttendanceModal";

export default function AttendanceRecords({ records }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = records.filter(
    (rec) =>
      rec.course.code.toLowerCase().includes(search.toLowerCase()) ||
      rec.course.title.toLowerCase().includes(search.toLowerCase()) ||
      rec.date.includes(search)
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="font-semibold text-lg mb-3">Past Records</h2>

      <input
        type="text"
        placeholder="Search by course or date"
        className="border p-2 mb-3 w-full rounded"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Time</th>
            <th className="p-2">Course</th>
            <th className="p-2">Dept</th>
            <th className="p-2">Sem</th>
            <th className="p-2 text-center">Present / Total</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((rec) => (
            <tr key={rec.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{rec.date}</td>
              <td className="p-2">{rec.time}</td>
              <td className="p-2">
                {rec.course.code} - {rec.course.title}
              </td>
              <td className="p-2">{rec.deptName}</td>
              <td className="p-2">{rec.semName}</td>
              <td className="p-2 text-center">
                {rec.presentStudents.length} / {rec.total}
              </td>
              <td className="p-2 text-center">
                <button
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded"
                  onClick={() => setSelectedRecord(rec)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
          {paginated.length === 0 && (
            <tr>
              <td colSpan={7} className="p-3 text-gray-500 text-center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-3 text-sm">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {selectedRecord && (
        <AttendanceModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}
