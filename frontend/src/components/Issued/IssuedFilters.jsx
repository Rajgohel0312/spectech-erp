import React from "react";
import { FiSearch } from "react-icons/fi";

export default function IssuedFilters({
  search,
  setSearch,
  rowsPerPage,
  setRowsPerPage,
  setCurrentPage,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Search Box */}
      <div className="relative w-full sm:w-64">
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search issued records..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color,#3b82f6)]"
        />
      </div>

      {/* Rows Per Page */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Rows per page:</label>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary-color,#3b82f6)]"
        >
          {[5, 10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
