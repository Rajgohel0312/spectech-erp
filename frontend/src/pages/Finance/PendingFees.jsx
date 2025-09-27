import { useEffect, useState } from "react";
import { groupByHierarchy, calcTotals } from "../../utils/feesHelpers";

export default function PendingFees() {
  const [fees, setFees] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fr = JSON.parse(localStorage.getItem("feeRecords")) || [];
    setFees(fr.filter((r) => (r.pending || 0) > 0));
  }, []);

  const grouped = groupByHierarchy(fees);
  const toggle = (key) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  const collegeTotals = (college) => {
    const list = Object.values(grouped[college]).flatMap((dept) => Object.values(dept).flat());
    return calcTotals(list);
  };
  const deptTotals = (college, dept) => {
    const list = Object.values(grouped[college][dept]).flat();
    return calcTotals(list);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">⏳ Pending Fees</h1>

      {Object.keys(grouped).map((college) => {
        const c = collegeTotals(college);
        const cKey = `c:${college}`;

        return (
          <div key={college} className="border rounded overflow-hidden">
            <button onClick={() => toggle(cKey)} className="w-full flex justify-between px-4 py-2 bg-amber-100">
              <span className="font-semibold">{college}</span>
              <span>Pending ₹{c.pending.toLocaleString()}</span>
            </button>

            {expanded[cKey] && (
              <div className="p-3 space-y-3">
                {Object.keys(grouped[college]).map((dept) => {
                  const d = deptTotals(college, dept);
                  const dKey = `${cKey}|d:${dept}`;
                  return (
                    <div key={dept} className="border rounded">
                      <button onClick={() => toggle(dKey)} className="w-full flex justify-between px-3 py-2 bg-yellow-50">
                        <span>🏫 {dept}</span>
                        <span>Pending ₹{d.pending.toLocaleString()}</span>
                      </button>

                      {expanded[dKey] && (
                        <div className="p-3 space-y-3">
                          {Object.keys(grouped[college][dept]).map((sem) => {
                            const list = grouped[college][dept][sem];
                            const s = calcTotals(list);
                            const sKey = `${dKey}|s:${sem}`;
                            return (
                              <div key={sem} className="border rounded">
                                <button onClick={() => toggle(sKey)} className="w-full flex justify-between px-3 py-2 bg-gray-50">
                                  <span>{sem}</span>
                                  <span>Pending ₹{s.pending.toLocaleString()}</span>
                                </button>

                                {expanded[sKey] && (
                                  <div className="overflow-x-auto">
                                    <table className="w-full border text-sm">
                                      <thead className="bg-gray-100">
                                        <tr>
                                          <th className="p-2 text-left">Student ID</th>
                                          <th className="p-2 text-left">Name</th>
                                          <th className="p-2 text-right">Pending</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {list.slice(0, 100).map((r) => (
                                          <tr key={r.studentId} className="border-b">
                                            <td className="p-2">{r.studentId}</td>
                                            <td className="p-2">{r.name}</td>
                                            <td className="p-2 text-right text-red-600">₹{r.pending.toLocaleString()}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                    {list.length > 100 && (
                                      <p className="text-xs text-gray-500 p-2">
                                        Showing 100 of {list.length} students…
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
