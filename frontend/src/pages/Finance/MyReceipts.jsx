import { useEffect, useMemo, useState } from "react";

export default function MyReceipts({ studentRollNo }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fr = JSON.parse(localStorage.getItem("feeRecords")) || [];
    setRecords(fr);
  }, []);

  const r = useMemo(() => records.find((x) => x.studentId === studentRollNo), [records, studentRollNo]);

  if (!r) return <div className="p-6">No receipts found for <b>{studentRollNo}</b>.</div>;

  const receipts = r.receipts || [];

  const downloadReceipt = (rec) => {
    const content = `Receipt
Student: ${r.name} (${r.studentId})
College: ${r.collegeName}
Department: ${r.deptName}
Date: ${rec.date}
Amount: ₹${rec.amount}
Mode: ${rec.mode}
Txn: ${rec.txnId || "-"}
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt_${r.studentId}_${rec.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🧾 My Receipts</h1>
      <ul className="space-y-2">
        {receipts.map((rec) => (
          <li key={rec.id} className="flex items-center justify-between p-3 bg-gray-100 rounded">
            <div>
              <div className="font-medium">{rec.date}</div>
              <div className="text-sm text-gray-600">Txn: {rec.txnId || "-"}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-semibold">₹{rec.amount.toLocaleString()}</div>
              <button onClick={() => downloadReceipt(rec)} className="px-3 py-1 bg-[var(--primary-color)] text-white rounded">
                Download
              </button>
            </div>
          </li>
        ))}
        {receipts.length === 0 && <li className="text-gray-600">No receipts yet.</li>}
      </ul>
    </div>
  );
}
