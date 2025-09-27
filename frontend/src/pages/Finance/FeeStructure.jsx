import { useEffect, useMemo, useState } from "react";
import { uniq } from "../../utils/feesHelpers";

export default function FeeStructure() {
  const [fees, setFees] = useState({}); // feeStructure in LS
  const [records, setRecords] = useState([]); // feeRecords for dropdowns

  const [college, setCollege] = useState("");
  const [dept, setDept] = useState("");
  const [sem, setSem] = useState("");

  useEffect(() => {
    const fs = JSON.parse(localStorage.getItem("feeStructure")) || {};
    setFees(fs);
    const fr = JSON.parse(localStorage.getItem("feeRecords")) || [];
    setRecords(fr);
  }, []);

  const colleges = useMemo(() => Object.keys(fees), [fees]);
  const departments = useMemo(
    () => (college ? Object.keys(fees[college] || {}) : []),
    [college, fees]
  );
  const semesters = useMemo(
    () => (college && dept ? Object.keys(fees[college]?.[dept] || {}) : []),
    [college, dept, fees]
  );

  const currentList =
    college && dept && sem ? fees[college][dept][sem] || [] : [];

  const [newItem, setNewItem] = useState({ key: "", amount: "" });

  const addItem = () => {
    if (!college || !dept || !sem) return alert("Select all filters first.");
    if (!newItem.key || !newItem.amount) return;

    const next = { ...fees };
    next[college][dept][sem] = [...currentList, { ...newItem, amount: +newItem.amount }];
    setFees(next);
    localStorage.setItem("feeStructure", JSON.stringify(next));
    setNewItem({ key: "", amount: "" });
  };

  const removeItem = (idx) => {
    const next = { ...fees };
    next[college][dept][sem] = currentList.filter((_, i) => i !== idx);
    setFees(next);
    localStorage.setItem("feeStructure", JSON.stringify(next));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">📊 Fee Structure (College/Dept/Sem)</h1>

      {/* Filters */}
      <div className="grid sm:grid-cols-3 gap-3">
        <select className="border p-2 rounded" value={college} onChange={(e) => {
          setCollege(e.target.value); setDept(""); setSem("");
        }}>
          <option value="">Select College</option>
          {colleges.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="border p-2 rounded" value={dept} onChange={(e) => {
          setDept(e.target.value); setSem("");
        }}>
          <option value="">Select Department</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select className="border p-2 rounded" value={sem} onChange={(e) => setSem(e.target.value)}>
          <option value="">Select Semester</option>
          {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* List */}
      {college && dept && sem ? (
        <>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Component</th>
                <th className="p-2 text-right">Amount (₹)</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {currentList.map((it, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{it.key}</td>
                  <td className="p-2 text-right">₹{it.amount.toLocaleString()}</td>
                  <td className="p-2 text-right">
                    <button onClick={() => removeItem(i)} className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {currentList.length === 0 && (
                <tr><td className="p-2 text-gray-500" colSpan={3}>No items yet.</td></tr>
              )}
            </tbody>
          </table>

          {/* Add */}
          <div className="mt-3 grid sm:grid-cols-3 gap-3">
            <input
              className="border p-2 rounded"
              placeholder="Component (e.g., Tuition)"
              value={newItem.key}
              onChange={(e) => setNewItem((p) => ({ ...p, key: e.target.value }))}
            />
            <input
              type="number"
              className="border p-2 rounded"
              placeholder="Amount"
              value={newItem.amount}
              onChange={(e) => setNewItem((p) => ({ ...p, amount: e.target.value }))}
            />
            <button onClick={addItem} className="bg-[var(--primary-color)] text-white rounded px-4">
              ➕ Add
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600">Select College, Department & Semester to view/edit structure.</p>
      )}
    </div>
  );
}
