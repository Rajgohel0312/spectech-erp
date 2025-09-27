import { useEffect, useMemo, useState } from "react";
import { uniq, getSemesterFromRoll } from "../../utils/feesHelpers";

export default function Payments() {
  const [records, setRecords] = useState([]); // feeRecords
  const [form, setForm] = useState({
    college: "",
    dept: "",
    sem: "",
    studentId: "",
    name: "",
    amount: "",
    mode: "Cash",
    date: new Date().toISOString().slice(0, 10),
    txnId: "",
  });
  const [table, setTable] = useState([]);

  useEffect(() => {
    const fr = JSON.parse(localStorage.getItem("feeRecords")) || [];
    setRecords(fr);
  }, []);

  const colleges = useMemo(() => uniq(records.map((r) => r.collegeName)), [records]);

  const departments = useMemo(() => {
    return form.college
      ? uniq(records.filter((r) => r.collegeName === form.college).map((r) => r.deptName))
      : [];
  }, [records, form.college]);

  const semesters = useMemo(() => {
    return form.college && form.dept
      ? uniq(
          records
            .filter((r) => r.collegeName === form.college && r.deptName === form.dept)
            .map((r) => `Semester ${getSemesterFromRoll(r.studentId)}`)
        ).sort((a, b) => parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]))
      : [];
  }, [records, form.college, form.dept]);

  const students = useMemo(() => {
    if (!form.college || !form.dept || !form.sem) return [];
    const semNo = parseInt(form.sem.split(" ")[1]);
    return records
      .filter(
        (r) =>
          r.collegeName === form.college &&
          r.deptName === form.dept &&
          r.semester === semNo
      )
      .sort((a, b) => a.studentId.localeCompare(b.studentId));
  }, [records, form.college, form.dept, form.sem]);

  const selectedStudent = useMemo(
    () => records.find((r) => r.studentId === form.studentId),
    [records, form.studentId]
  );

  const onStudentChange = (id) => {
    const r = records.find((x) => x.studentId === id);
    setForm((p) => ({ ...p, studentId: id, name: r?.name || "" }));
  };

  const addPayment = () => {
    if (!selectedStudent) return alert("Select a student.");
    const amt = Number(form.amount);
    if (!amt || amt <= 0) return alert("Enter a valid amount.");

    const updated = records.map((r) => {
      if (r.studentId !== selectedStudent.studentId) return r;
      const newPaid = r.paid + amt;
      const newPending = Math.max(0, r.totalFee - newPaid);
      return {
        ...r,
        paid: newPaid,
        pending: newPending,
        receipts: [
          ...(r.receipts || []),
          {
            id: `${r.studentId}-${Date.now()}`,
            date: form.date,
            amount: amt,
            mode: form.mode,
            txnId: form.txnId || `TXN-${Math.random().toString(36).slice(2, 8)}`,
          },
        ],
      };
    });

    localStorage.setItem("feeRecords", JSON.stringify(updated));
    setRecords(updated);
    setTable((t) => [
      ...t,
      {
        studentId: selectedStudent.studentId,
        name: selectedStudent.name,
        amount: amt,
        mode: form.mode,
        date: form.date,
        txnId: form.txnId,
      },
    ]);

    // reset only amount & txn
    setForm((p) => ({ ...p, amount: "", txnId: "" }));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">💰 Record Payments</h1>

      {/* Cascading Filters */}
      <div className="grid lg:grid-cols-5 sm:grid-cols-2 gap-3 mb-4">
        <select
          className="border p-2 rounded"
          value={form.college}
          onChange={(e) => setForm((p) => ({ ...p, college: e.target.value, dept: "", sem: "", studentId: "", name: "" }))}
        >
          <option value="">Select College</option>
          {colleges.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="border p-2 rounded"
          value={form.dept}
          onChange={(e) => setForm((p) => ({ ...p, dept: e.target.value, sem: "", studentId: "", name: "" }))}
          disabled={!form.college}
        >
          <option value="">Select Department</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          className="border p-2 rounded"
          value={form.sem}
          onChange={(e) => setForm((p) => ({ ...p, sem: e.target.value, studentId: "", name: "" }))}
          disabled={!form.dept}
        >
          <option value="">Select Semester</option>
          {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          className="border p-2 rounded"
          value={form.studentId}
          onChange={(e) => onStudentChange(e.target.value)}
          disabled={!form.sem}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.studentId} value={s.studentId}>
              {s.studentId} — {s.name}
            </option>
          ))}
        </select>

        <input className="border p-2 rounded" placeholder="Student Name" value={form.name} readOnly />
      </div>

      {/* Payment Form */}
      <div className="grid sm:grid-cols-5 gap-3 items-end">
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
        />
        <select
          className="border p-2 rounded"
          value={form.mode}
          onChange={(e) => setForm((p) => ({ ...p, mode: e.target.value }))}
        >
          <option>Cash</option>
          <option>Online</option>
          <option>Cheque</option>
        </select>
        <input
          type="date"
          className="border p-2 rounded"
          value={form.date}
          onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
        />
        <input
          className="border p-2 rounded"
          placeholder="Txn ID (optional)"
          value={form.txnId}
          onChange={(e) => setForm((p) => ({ ...p, txnId: e.target.value }))}
        />
        <button onClick={addPayment} className="px-4 py-2 bg-green-600 text-white rounded">
          ✅ Record Payment
        </button>
      </div>

      {/* Student Balance Snapshot */}
      {selectedStudent && (
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50 rounded">Total: ₹{selectedStudent.totalFee.toLocaleString()}</div>
          <div className="p-3 bg-green-50 rounded">Paid: ₹{selectedStudent.paid.toLocaleString()}</div>
          <div className="p-3 bg-red-50 rounded">Pending: ₹{selectedStudent.pending.toLocaleString()}</div>
        </div>
      )}

      {/* Recorded payments (session) */}
      <h2 className="text-lg font-semibold mt-6">📜 Payment Records (this session)</h2>
      <div className="overflow-x-auto">
        <table className="w-full border mt-2 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Student ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-right">Amount</th>
              <th className="p-2">Mode</th>
              <th className="p-2">Date</th>
              <th className="p-2">Txn</th>
            </tr>
          </thead>
          <tbody>
            {table.map((p, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{p.studentId}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2 text-right">₹{p.amount.toLocaleString()}</td>
                <td className="p-2">{p.mode}</td>
                <td className="p-2">{p.date}</td>
                <td className="p-2">{p.txnId || "-"}</td>
              </tr>
            ))}
            {table.length === 0 && (
              <tr><td className="p-2 text-gray-500" colSpan={6}>No payments recorded in this session.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
