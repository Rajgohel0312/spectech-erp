import React from "react";

export default function ProductFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  productTypes,
  rowsPerPage,
  setRowsPerPage,
  setCurrentPage,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center sticky top-0 z-10">
      <input
        type="text"
        placeholder="Search all fields..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color,#3b82f6)]"
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-2 border rounded-lg"
      >
        <option value="">All Status</option>
        <option value="Available">Available</option>
        <option value="Low Stock">Low Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="px-3 py-2 border rounded-lg"
      >
        <option value="">All Types</option>
        {productTypes.map((t, i) => (
          <option key={i} value={t}>
            {t}
          </option>
        ))}
      </select>
      <select
        value={rowsPerPage}
        onChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
        className="px-3 py-2 border rounded-lg"
      >
        <option value={5}>5 rows</option>
        <option value={10}>10 rows</option>
        <option value={20}>20 rows</option>
      </select>
    </div>
  );
}
