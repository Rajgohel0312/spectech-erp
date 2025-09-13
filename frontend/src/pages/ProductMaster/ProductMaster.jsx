import React, { useState, useEffect } from "react";
import { FaPlus, FaFileImport, FaFileExport } from "react-icons/fa";

import ProductFilters from "../../components/Product/ProductFilters";
import ProductTable from "../../components/Product/ProductTable";
import ProductModal from "../../components/Product/ProductModal";
import ProductViewModal from "../../components/Product/ProductViewModal";
import ProductIssueModal from "../../components/Product/ProductIssueModal";
import ProductDeleteModal from "../../components/Product/ProductDeleteModal"; 

const initialProducts = [
  {
    id: 1,
    type: "Chemical",
    name: "Acetone",
    cas: "67-64-1",
    qty: 100,
    unit: "L",
    expiry: "2026-01-01",
    location: "Store A",
    status: "Available",
  },
  {
    id: 2,
    type: "Reagent",
    name: "Sodium Chloride",
    cas: "7647-14-5",
    qty: 50,
    unit: "kg",
    expiry: "2025-08-15",
    location: "Store B",
    status: "Low Stock",
  },
];

export default function ProductMaster() {
  const [products, setProducts] = useState(initialProducts);
  const [productTypes, setProductTypes] = useState(["Chemical", "Reagent"]);

  // State for modals
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showView, setShowView] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [showIssue, setShowIssue] = useState(null);

  // Filters, search, sort, pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => setCurrentPage(1), [search, statusFilter, typeFilter]);

  // Filter + search
  const filteredProducts = products.filter((p) => {
    const matchesSearch = Object.values(p).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    const matchesType = typeFilter ? p.type === typeFilter : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalPages = Math.ceil(sortedProducts.length / rowsPerPage);

  // Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Import / Export
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) alert(`Imported ${file.name} (demo only)`);
  };
  const handleExport = () => {
    alert("Exported products (demo only)");
  };

  return (
    <div className="p-6 bg-[var(--background-color,#f9fafb)] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-color,#111827)]">
          Product Master
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[var(--primary-color,#3b82f6)] text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
          >
            <FaPlus /> Add Product
          </button>
          <label className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer">
            <FaFileImport /> Import
            <input
              type="file"
              onChange={handleImport}
              className="hidden"
              accept=".csv,.xlsx"
            />
          </label>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <FaFileExport /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <ProductFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        productTypes={productTypes}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Table */}
      <ProductTable
        products={paginatedProducts}
        sortConfig={sortConfig}
        handleSort={handleSort}
        onView={setShowView}
        onEdit={(p) => {
          setEditingProduct(p);
          setShowModal(true); // ✅ Open modal in edit mode
        }}
        onIssue={setShowIssue}
        onDelete={setShowDelete}
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} -{" "}
          {Math.min(startIndex + rowsPerPage, sortedProducts.length)} of{" "}
          {sortedProducts.length}
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

      {/* Modals */}
      {showModal && (
        <ProductModal
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          editingProduct={editingProduct}
          setProducts={setProducts}
          products={products}
          productTypes={productTypes}
          setProductTypes={setProductTypes}
        />
      )}

      {showView && (
        <ProductViewModal
          product={showView}
          onClose={() => setShowView(null)}
        />
      )}

      {showIssue && (
        <ProductIssueModal
          product={showIssue}
          setProducts={setProducts}
          products={products}
          onClose={() => setShowIssue(null)}
        />
      )}

      {showDelete && (
        <ProductDeleteModal
          product={showDelete}
          setProducts={setProducts}
          products={products}
          onClose={() => setShowDelete(null)}
        />
      )}
    </div>
  );
}
