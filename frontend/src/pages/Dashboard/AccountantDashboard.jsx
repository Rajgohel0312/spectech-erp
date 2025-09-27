import { useEffect, useState } from "react";

export default function AccountantDashboard({ deptName }) {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("feeRecords")) || [];
    setFees(saved.filter((f) => f.deptName === deptName));
  }, [deptName]);

  const totalCollected = fees.reduce((sum, f) => sum + f.paid, 0);
  const totalPending = fees.reduce((sum, f) => sum + f.pending, 0);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🏫 {deptName} Accountant Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-100 rounded">Collected: ₹{totalCollected}</div>
        <div className="p-4 bg-red-100 rounded">Pending: ₹{totalPending}</div>
      </div>

      <h2 className="text-lg font-semibold mt-4">⏳ Pending Students</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Student ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Pending</th>
          </tr>
        </thead>
        <tbody>
          {fees.filter((f) => f.pending > 0).map((f, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{f.studentId}</td>
              <td className="p-2">{f.name}</td>
              <td className="p-2 text-red-600 font-semibold">₹{f.pending}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
