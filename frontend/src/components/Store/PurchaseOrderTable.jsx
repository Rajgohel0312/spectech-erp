import React from "react";
import { FaDownload, FaEdit, FaTrash } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
export default function PurchaseOrderTable({
  purchaseOrders,
  onEdit,
  onDownload,
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-3 text-left">PO Number</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Supplier</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Remarks</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="px-4 py-6 text-center text-gray-500 italic"
              >
                No purchase orders found
              </td>
            </tr>
          ) : (
            purchaseOrders.map((po) => (
              <tr key={po.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3">{po.poNumber}</td>
                <td className="px-4 py-3">{po.date}</td>
                <td className="px-4 py-3">{po.supplier}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      po.status === "Draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : po.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {po.status}
                  </span>
                </td>
                <td className="px-4 py-3 italic text-gray-500">
                  {po.remarks || "—"}
                </td>

                <td className="px-4 py-3 flex justify-center gap-4">
                  <button
                    onClick={() => onEdit(po)}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Edit PO"
                  >
                    <FaEdit className="text-green-600 hover:text-green-800" />
                  </button>
                  <button
                    onClick={() => onDownload(po)}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Download PO"
                  >
                    <FaDownload className="text-blue-600 hover:text-blue-800" />
                  </button>
                  <button
                    onClick={() =>
                      alert(`Delete ${po.poNumber} not implemented yet`)
                    }
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Delete PO"
                  >
                    <FaTrash className="text-red-600 hover:text-red-800" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Tooltip id="tooltip" place="top" effect="solid" />
    </div>
  );
}
