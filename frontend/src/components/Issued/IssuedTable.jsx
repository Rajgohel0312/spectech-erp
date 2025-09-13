import React from "react";

export default function IssuedTable({ issued, role }) {
  // Base headers
  const baseHeaders = [
    { key: "date", label: "Date & Time" },
    { key: "product", label: "Product" },
    { key: "batch", label: "Batch No." },
    { key: "qty", label: "Qty Issued" },
    { key: "unit", label: "Unit" },
    { key: "issuedTo", label: "Issued To" },
    { key: "issuedBy", label: "Issued By" },
    { key: "remarks", label: "Remarks" },
  ];

  // Role-based headers (Hazard removed ✅)
  const roleHeaders =
    role === "storeManager"
      ? [
          { key: "cas", label: "CAS No." },
          { key: "expiry", label: "Expiry Date" },
          { key: "balance", label: "Remaining Stock" },
        ]
      : role === "labAssistant"
      ? [
          { key: "returnDate", label: "Return Date" },
          { key: "condition", label: "Condition" },
        ]
      : [];

  // If viewing all, add Role column
  const headers =
    role === "all"
      ? [...baseHeaders, { key: "role", label: "Role" }]
      : [...baseHeaders, ...roleHeaders];

  // Calculate balance for Store Manager
  const calculateBalance = (row) => {
    if (row.role !== "storeManager") return null;
    const totalIssued = issued
      .filter((r) => r.product === row.product && r.batch === row.batch)
      .reduce((sum, r) => sum + r.qty, 0);
    return row.initialStock ? row.initialStock - totalIssued : "N/A";
  };

  // 🔹 Filter rows based on role
  const visibleRows =
    role === "all" ? issued : issued.filter((row) => row.role === role);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            {headers.map((h) => (
              <th key={h.key} className="px-4 py-3 text-left">
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-6 text-center text-gray-500 italic"
              >
                No records found
              </td>
            </tr>
          ) : (
            visibleRows.map((row) => (
              <tr
                key={row.id}
                className="border-b hover:bg-gray-50 transition"
              >
                {headers.map((h) => {
                  let value = row[h.key];

                  // For balance, compute dynamically
                  if (h.key === "balance") {
                    value = calculateBalance(row);
                  }

                  // Role badge if showing "all"
                  if (h.key === "role") {
                    return (
                      <td key={h.key} className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded font-medium ${
                            row.role === "storeManager"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {row.role === "storeManager"
                            ? "Store Manager"
                            : "Lab Assistant"}
                        </span>
                      </td>
                    );
                  }

                  // Fallback for empty values
                  if (
                    value === null ||
                    value === undefined ||
                    value === "" ||
                    value === "—"
                  ) {
                    value = (
                      <span className="italic text-gray-400 text-xs">N/A</span>
                    );
                  }

                  // Low stock badge
                  const isLow =
                    h.key === "balance" &&
                    typeof value === "number" &&
                    row.initialStock &&
                    value <= row.initialStock * 0.1;

                  return (
                    <td key={h.key} className="px-4 py-3">
                      {isLow ? (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                          Low: {value}
                        </span>
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
