import { useEffect, useState } from "react";

export default function AccountantDashboard({ collegeName }) {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("feeRecords")) || [];
    if (collegeName) {
      setFees(saved.filter((f) => f.collegeName === collegeName));
    } else {
      setFees([]);
    }
  }, [collegeName]);

  const totalCollected = fees.reduce((sum, f) => sum + (f.paid || 0), 0);
  const totalPending = fees.reduce((sum, f) => sum + (f.pending || 0), 0);
  const pendingStudents = fees.filter((f) => f.pending > 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        🏫 Accountant Dashboard {collegeName ? `(${collegeName})` : ""}
      </h1>

      {fees.length > 0 ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-100 rounded shadow">
              <h3 className="font-semibold">Collected</h3>
              <p className="text-lg text-green-700">{formatCurrency(totalCollected)}</p>
            </div>
            <div className="p-4 bg-red-100 rounded shadow">
              <h3 className="font-semibold">Pending</h3>
              <p className="text-lg text-red-700">{formatCurrency(totalPending)}</p>
            </div>
          </div>

          {/* Pending Students Table */}
          <h2 className="text-lg font-semibold mt-6">⏳ Pending Students</h2>
          {pendingStudents.length > 0 ? (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Student ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Pending</th>
                </tr>
              </thead>
              <tbody>
                {pendingStudents.map((f, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{f.studentId}</td>
                    <td className="p-2">{f.name}</td>
                    <td className="p-2 text-red-600 font-semibold">
                      {formatCurrency(f.pending)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 mt-2">🎉 No pending fees — all clear!</p>
          )}
        </>
      ) : (
        <p className="text-gray-600">No fee records found for this college.</p>
      )}
    </div>
  );
}
