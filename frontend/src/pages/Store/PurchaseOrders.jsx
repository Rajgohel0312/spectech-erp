import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import PurchaseOrderTable from "../../components/Store/PurchaseOrderTable";
import PurchaseOrderModal from "../../components/Store/PurchaseOrderModal";
import { generatePOpdf } from "../../utils/generatePOpdf";

const initialPOs = [
  {
    id: 1,
    poNumber: "PO-2025-001",
    date: "2025-09-13",
    supplier: "ABC Chemicals",
    status: "Draft",
    remarks: "Urgent stock required",
    products: [
      { name: "Acetone", qty: 50, unit: "L", rate: 200, total: 10000 },
      { name: "Sodium Chloride", qty: 100, unit: "kg", rate: 50, total: 5000 },
    ],
  },
  {
    id: 2,
    poNumber: "PO-2025-002",
    date: "2025-09-12",
    supplier: "XYZ Supplies",
    status: "Approved",
    remarks: "For lab requirements",
    products: [
      { name: "Sulfuric Acid", qty: 10, unit: "L", rate: 300, total: 3000 },
    ],
  },
];

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState(initialPOs);
  const [showModal, setShowModal] = useState(false);
  const [editingPO, setEditingPO] = useState(null);

  // Filters, search, pagination
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => setCurrentPage(1), [search]);

  // Search filter
  const filteredPOs = purchaseOrders.filter((p) =>
    Object.values(p).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  // Pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPOs = filteredPOs.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(filteredPOs.length / rowsPerPage);

  return (
    <div className="p-6 bg-[var(--background-color,#f9fafb)] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-color,#111827)]">
          Purchase Orders
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingPO(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[var(--primary-color,#3b82f6)] text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
          >
            <FaPlus /> Create PO
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search purchase orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color,#3b82f6)]"
        />
      </div>

      {/* Table */}
      <PurchaseOrderTable
        purchaseOrders={paginatedPOs}
        onEdit={(po) => {
          setEditingPO(po);
          setShowModal(true);
        }}
        onDownload={generatePOpdf}
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} -{" "}
          {Math.min(startIndex + rowsPerPage, filteredPOs.length)} of{" "}
          {filteredPOs.length}
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <PurchaseOrderModal
          onClose={() => {
            setShowModal(false);
            setEditingPO(null);
          }}
          editingPO={editingPO}
          setPurchaseOrders={setPurchaseOrders}
          purchaseOrders={purchaseOrders}
        />
      )}
    </div>
  );
}
