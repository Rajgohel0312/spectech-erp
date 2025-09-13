import React, { useState, useEffect } from "react";
import { FaFileExport } from "react-icons/fa";

import IssuedFilters from "../../components/Issued/IssuedFilters";
import IssuedTable from "../../components/Issued/IssuedTable";
import IssuedExportModal from "../../components/Issued/IssuedExportModal";
const initialIssued = [
  // 🔹 Store Manager (Chemicals)
  {
    id: 1,
    role: "storeManager",
    date: "2025-09-13 10:30 AM",
    product: "Acetone",
    batch: "BATCH-CH-001",
    qty: 5,
    unit: "L",
    issuedTo: "Chemistry Lab",
    issuedBy: "Store Manager",
    remarks: "Flammable chemical",
    cas: "67-64-1",
    expiry: "2026-01-01",
    initialStock: 100,
  },
  {
    id: 2,
    role: "storeManager",
    date: "2025-09-12 03:15 PM",
    product: "Sodium Chloride",
    batch: "BATCH-CH-002",
    qty: 12,
    unit: "kg",
    issuedTo: "Faculty A",
    issuedBy: "Store Manager",
    remarks: "For experiment",
    cas: "7647-14-5",
    expiry: "2025-12-15",
    initialStock: 200,
  },
  {
    id: 3,
    role: "storeManager",
    date: "2025-09-10 09:45 AM",
    product: "Sulfuric Acid",
    batch: "BATCH-CH-003",
    qty: 3,
    unit: "L",
    issuedTo: "Technician Team",
    issuedBy: "Store Manager",
    remarks: "Handle with care",
    cas: "7664-93-9",
    expiry: "2025-11-01",
    initialStock: 50,
  },

  // 🔹 Lab Assistant (Equipment)
  {
    id: 4,
    role: "labAssistant",
    date: "2025-09-11 11:20 AM",
    product: "Microscope",
    batch: "BATCH-LAB-001",
    qty: 1,
    unit: "pcs",
    issuedTo: "Student Group A",
    issuedBy: "Lab Assistant",
    remarks: "Borrowed for biology project",
    returnDate: "2025-09-20",
    condition: "Good",
    initialStock: 10,
  },
  {
    id: 5,
    role: "labAssistant",
    date: "2025-09-09 02:40 PM",
    product: "Beaker Set",
    batch: "BATCH-LAB-002",
    qty: 2,
    unit: "sets",
    issuedTo: "Chemistry Lab",
    issuedBy: "Lab Assistant",
    remarks: "Glassware for practicals",
    returnDate: "2025-09-16",
    condition: "Good",
    initialStock: 30,
  },
  {
    id: 6,
    role: "labAssistant",
    date: "2025-09-08 04:00 PM",
    product: "Electronic Balance",
    batch: "BATCH-LAB-003",
    qty: 1,
    unit: "pcs",
    issuedTo: "Faculty B",
    issuedBy: "Lab Assistant",
    remarks: "Calibration required",
    returnDate: "2025-09-15",
    condition: "Needs Calibration",
    initialStock: 5,
  },

  // 🔹 Store Manager (Machines / Spare Parts)
  {
    id: 7,
    role: "storeManager",
    date: "2025-09-13 10:30 AM",
    product: "Shot Blasting Machine",
    batch: "BATCH-MC-001",
    qty: 5,
    unit: "pcs",
    issuedTo: "Raj Gohel",
    issuedBy: "Store Manager",
    remarks: "Urgent requirement",
    initialStock: 100,
  },
  {
    id: 8,
    role: "storeManager",
    date: "2025-09-12 04:15 PM",
    product: "Spare Parts",
    batch: "BATCH-MC-002",
    qty: 12,
    unit: "pcs",
    issuedTo: "Technician Team",
    issuedBy: "Store Manager",
    remarks: "",
    initialStock: 100,
  },
];

export default function IssuedHistory({ userRole }) {
  // userRole = "storeManager" OR "labAssistant"
  const [issued] = useState(initialIssued);

  // Filters, search, sort, pagination
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => setCurrentPage(1), [search]);

  // 🔎 Filter + Search + Role restriction
  const filteredIssued = issued.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
    const matchesRole = item.role === userRole; // 🔐 enforce role
    return matchesSearch && matchesRole;
  });

  // ↕ Sort
  const sortedIssued = [...filteredIssued].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // 📄 Pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedIssued = sortedIssued.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalPages = Math.ceil(sortedIssued.length / rowsPerPage);

  // Sorting Handler
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Export
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="p-6 bg-[var(--background-color,#f9fafb)] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-color,#111827)]">
          Issued History
        </h1>
        <button
          onClick={() => setShowExport(true)}
          className="flex items-center gap-2 bg-[var(--primary-color,#3b82f6)] text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
        >
          <FaFileExport /> Export Report
        </button>
      </div>

      {/* Filters */}
      <IssuedFilters
        search={search}
        setSearch={setSearch}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Table */}
      <IssuedTable
        issued={paginatedIssued}
        sortConfig={sortConfig}
        handleSort={handleSort}
        role={userRole} // 🔐 locked role
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} -{" "}
          {Math.min(startIndex + rowsPerPage, sortedIssued.length)} of{" "}
          {sortedIssued.length}
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

      {/* Export Modal */}
      {showExport && (
        <IssuedExportModal
          role={userRole} // 🔐 locked role
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
