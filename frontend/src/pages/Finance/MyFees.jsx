import { useEffect, useMemo, useState } from "react";

export default function MyFees({ studentRollNo }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fr = JSON.parse(localStorage.getItem("feeRecords")) || [];
    setRecords(fr);
  }, []);

  const r = useMemo(() => records.find((x) => x.studentId === studentRollNo), [records, studentRollNo]);

  if (!r) return <div className="p-6">No record found for <b>{studentRollNo}</b>.</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">💳 My Fees</h1>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="p-3 bg-blue-50 rounded">Total: ₹{r.totalFee.toLocaleString()}</div>
        <div className="p-3 bg-green-50 rounded">Paid: ₹{r.paid.toLocaleString()}</div>
        <div className="p-3 bg-red-50 rounded">Pending: ₹{r.pending.toLocaleString()}</div>
      </div>
      <div className="text-sm text-gray-600">
        <div>College: {r.collegeName}</div>
        <div>Department: {r.deptName}</div>
        <div>Semester: {r.semester}</div>
      </div>
    </div>
  );
}
