import { useEffect, useMemo, useState } from "react";
import { uniq, getSemesterFromRoll, downloadCSV, toCSV } from "../../utils/feesHelpers";

export default function FinanceReports() {
  const [fees, setFees] = useState([]);
  const [college, setCollege] = useState("");
  const [dept, setDept] = useState("");
  const [sem, setSem] = useState("");
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 100; // students per page

  useEffect(() => {
    const fr = JSON.parse(localStorage.getItem("feeRecords")) || [];
    setFees(fr);
  }, []);

  const colleges = useMemo(() => uniq(fees.map((r) => r.collegeName)), [fees]);

  const departments = useMemo(() => {
    return college ? uniq(fees.filter((f) => f.collegeName === college).map((f) => f.deptName)) : [];
  }, [fees, college]);

  const semesters = useMemo(() => {
    return dept
      ? uniq(
          fees
            .filter((f) => f.collegeName === college && f.deptName === dept)
            .map((f) => `Semester ${getSemesterFromRoll(f.studentId)}`)
        ).sort((a, b) => parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]))
      : [];
  }, [fees, college, dept]);

  const filtered = useMemo(() => {
    return fees.filter(
      (f) =>
        (!college || f.collegeName === college) &&
        (!dept || f.deptName === dept) &&
        (!sem || `Semester ${f.semester}` === sem) &&
        (!search ||
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.studentId.toLowerCase().includes(search.toLowerCase()))
    );
  }, [fees, college, dept, sem, search]);

  const totals = useMemo(() => {
    const total = filtered.reduce((a, b) => a + b.totalFee, 0);
    const collected = filtered.reduce((a, b) => a + b.paid, 0);
    const pending = filtered.reduce((a, b) => a + b.pending, 0);
    return { total, collected, pending };
  }, [filtered]);

  const exportCSV = () => {
    const headers = ["studentId", "name", "collegeName", "deptName", "semester", "totalFee", "paid", "pending"];
    const csv = toCSV(filtered, headers);
    const title = [
      "finance",
      college ? college.replace(/\s+/g, "_") : "all",
      dept ? dept.replace(/\s+/g, "_") : "all",
      sem ? sem.replace(/\s+/g, "_") : "all",
      "report.csv",
    ].join("_");
    downloadCSV(title, csv);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">📑 Finance Reports</h1>

      {/* Filters */}
      <div className="grid md:grid-cols-5 sm:grid-cols-2 gap-3">
        <select
          className="border p-2 rounded"
          value={college}
          onChange={(e) => {
            setCollege(e.target.value);
            setDept("");
            setSem("");
            setPage(1);
          }}
        >
          <option value="">All Colleges</option>
          {colleges.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={dept}
          onChange={(e) => {
            setDept(e.target.value);
            setSem("");
            setPage(1);
          }}
          disabled={!college}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={sem}
          onChange={(e) => {
            setSem(e.target.value);
            setPage(1);
          }}
          disabled={!dept}
        >
          <option value="">All Semesters</option>
          {semesters.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search by ID or Name..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <button
          onClick={exportCSV}
          className="bg-blue-600 text-white rounded px-4"
        >
          ⬇️ Export CSV
        </button>
      </div>

      {/* Totals */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="p-3 bg-blue-50 rounded">
          Total: ₹{totals.total.toLocaleString()}
        </div>
        <div className="p-3 bg-green-50 rounded">
          Collected: ₹{totals.collected.toLocaleString()}
        </div>
        <div className="p-3 bg-red-50 rounded">
          Pending: ₹{totals.pending.toLocaleString()}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm mt-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Student ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">College</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-right">Semester</th>
              <th className="p-2 text-right">Total</th>
              <th className="p-2 text-right">Paid</th>
              <th className="p-2 text-right">Pending</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((r) => (
              <tr key={r.studentId} className="border-b">
                <td className="p-2">{r.studentId}</td>
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.collegeName}</td>
                <td className="p-2">{r.deptName}</td>
                <td className="p-2 text-right">{r.semester}</td>
                <td className="p-2 text-right">
                  ₹{r.totalFee.toLocaleString()}
                </td>
                <td className="p-2 text-right text-green-600">
                  ₹{r.paid.toLocaleString()}
                </td>
                <td className="p-2 text-right text-red-600">
                  ₹{r.pending.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ◀ Prev
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}
