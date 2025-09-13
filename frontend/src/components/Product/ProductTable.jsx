import React from "react";
import { FaEye, FaEdit, FaFlask, FaTrash } from "react-icons/fa";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { Tooltip } from "react-tooltip";

export default function ProductTable({
  products,
  sortConfig,
  handleSort,
  onView,
  onEdit,
  onIssue,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {[
              { key: "type", label: "Product Type" },
              { key: "name", label: "Product Name" },
              { key: "cas", label: "CAS No" },
              { key: "qty", label: "Qty Available" },
              { key: "unit", label: "Unit" },
              { key: "expiry", label: "Expiry" },
              { key: "location", label: "Location" },
              { key: "status", label: "Status" },
            ].map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {sortConfig.key === col.key &&
                    (sortConfig.direction === "asc" ? (
                      <HiChevronUp className="w-4 h-4" />
                    ) : (
                      <HiChevronDown className="w-4 h-4" />
                    ))}
                </div>
              </th>
            ))}
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50 transition">
              <td className="px-4 py-3">{p.type}</td>
              <td className="px-4 py-3 font-medium">{p.name}</td>
              <td className="px-4 py-3">{p.cas}</td>
              <td className="px-4 py-3">{p.qty}</td>
              <td className="px-4 py-3">{p.unit}</td>
              <td className="px-4 py-3">{p.expiry}</td>
              <td className="px-4 py-3">{p.location}</td>
              <td className="px-4 py-3">{p.status}</td>
              <td className="px-4 py-3 flex justify-center gap-4">
                <button
                  onClick={() => onView(p)}
                  data-tooltip-id="tooltip"
                  data-tooltip-content="View Product"
                >
                  <FaEye className="text-blue-600 hover:text-blue-800" />
                </button>
                <button
                  onClick={() => onEdit(p)}
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Edit Product"
                >
                  <FaEdit className="text-green-600 hover:text-green-800" />
                </button>
                <button
                  onClick={() => onIssue(p)}
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Issue Product"
                >
                  <FaFlask className="text-purple-600 hover:text-purple-800" />
                </button>
                <button
                  onClick={() => onDelete(p)}
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Delete Product"
                >
                  <FaTrash className="text-red-600 hover:text-red-800" />
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center py-10 text-gray-500">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Tooltip for all action buttons */}
      <Tooltip id="tooltip" place="top" effect="solid" />
    </div>
  );
}
